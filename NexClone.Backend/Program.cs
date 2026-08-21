using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System;
using System.Text;
using Minio;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Hangfire;
using Hangfire.PostgreSql;
using NexClone.Backend.Infrastructure.Consumers;


var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/system.log", rollingInterval: RollingInterval.Day, shared: true)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<NexClone.Backend.Filters.CrudSuccessMessageFilter>();
})
    .AddViewLocalization()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddSingleton<Microsoft.Extensions.Localization.IStringLocalizerFactory, NexClone.Backend.Infrastructure.Localization.JsonStringLocalizerFactory>();
builder.Services.AddLocalization();

builder.Services.AddSignalR();

// Persist DataProtection keys to DB so antiforgery tokens survive container restarts
builder.Services.AddDataProtection()
    .PersistKeysToDbContext<ApplicationDbContext>();

// Setup CORS for Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextjs", policyBuilder =>
    {
        policyBuilder.SetIsOriginAllowed(origin => true)
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Setup PostgreSQL Database (Identity)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

// Setup Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    // Brute Force Protection: lock account after 20 failed attempts for 15 minutes
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 20;
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Register custom password hasher for Django PBKDF2 backwards compatibility
builder.Services.AddScoped<IPasswordHasher<ApplicationUser>, NexClone.Backend.Infrastructure.ExternalServices.DjangoPasswordHasher>();

// Setup JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddCookie(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.LoginPath = "/AdminAuth/Login";
    options.AccessDeniedPath = "/AdminAuth/AccessDenied";
    options.Cookie.Name = "AdminAuthCookie";
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"]
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwt"))
            {
                context.Token = context.Request.Cookies["jwt"];
            }
            return Task.CompletedTask;
        }
    };
});

// Setup HttpClient for AI Microservices
builder.Services.AddHttpClient("AIGateway", client =>
{
    // The base address could be a docker service name or localhost depending on deployment
    client.BaseAddress = new Uri("http://localhost:5000"); // Example port for Flask apps
});

builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.ITtsService, NexClone.Backend.Infrastructure.ExternalServices.AI.TtsService>();
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.ISttService, NexClone.Backend.Infrastructure.ExternalServices.AI.SttService>();
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.IVideoService, NexClone.Backend.Infrastructure.ExternalServices.AI.VideoService>();

// Register TTS Catalog Service
builder.Services.AddSingleton<NexClone.Backend.Core.Interfaces.ITtsCatalogService, NexClone.Backend.Application.Services.TtsCatalogService>();

// Register Media Service
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.IMediaService, NexClone.Backend.Infrastructure.ExternalServices.S3MediaService>();
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.ISubscriptionPermissionService, NexClone.Backend.Application.Services.SubscriptionPermissionService>();

// Register Email Service
builder.Services.AddScoped<NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService>();
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.IEmailService, NexClone.Backend.Infrastructure.ExternalServices.QueueEmailService>();
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.IEmailTemplateService, NexClone.Backend.Application.Services.EmailTemplateService>();

// Register Payment Service
builder.Services.AddHttpClient();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.ExternalServices.Invoicing.IInvoiceGeneratorService, NexClone.Backend.Infrastructure.ExternalServices.Invoicing.InvoiceGeneratorService>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.ExternalServices.Payments.PayPalPaymentService>();
builder.Services.AddScoped<NexClone.Backend.Core.Interfaces.IPaymentService, NexClone.Backend.Infrastructure.ExternalServices.Payments.PaymobPaymentService>();

// Register Credit Manager
builder.Services.AddScoped<NexClone.Backend.Application.Services.WalletService>();
builder.Services.AddScoped<NexClone.Backend.Application.Services.UsagePolicyService>();

// Register Affiliate Service
builder.Services.AddScoped<NexClone.Backend.Application.Services.AffiliateService>();
builder.Services.AddScoped<NexClone.Backend.Application.BackgroundJobs.AffiliateCommissionHoldJob>();

// Register Background Services
builder.Services.AddHostedService<NexClone.Backend.Application.BackgroundJobs.SubscriptionStatusService>();
builder.Services.AddHostedService<NexClone.Backend.Application.BackgroundJobs.MediaCleanupService>();

// Register Dynamic Concurrency Manager
builder.Services.AddSingleton<NexClone.Backend.Core.Interfaces.IDynamicConcurrencyManager, NexClone.Backend.Application.Services.DynamicConcurrencyManager>();

// Configure Hangfire with PostgreSQL
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(Hangfire.CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add the processing server as IHostedService
builder.Services.AddHangfireServer(options => {
    options.WorkerCount = Environment.ProcessorCount * 5;
    options.Queues = new[] { "default", "avatar_video_queue", "lipsync_queue", "tts_queue", "vtt_queue", "motion_control_queue", "email_queue" };
});

// Register Consumers as Scoped services so Hangfire can instantiate them
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.AvatarVideoConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.LipSyncConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.TtsConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.VttConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.MotionControlConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.VideoToolConsumer>();
builder.Services.AddScoped<NexClone.Backend.Infrastructure.Consumers.ImageToolConsumer>();


// Add Rate Limiting (Partitioned per Client IP)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
    // General API policy: 100 requests/minute per IP
    options.AddPolicy("ApiPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));

    // Strict auth policy: 30 requests/minute per IP to prevent brute force
    options.AddPolicy("AuthPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

// Add OpenAPI (net10.0)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddHealthChecks();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

app.UseForwardedHeaders();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();

    // Seed Default Settings
    var defaultSettings = new List<AppSetting>
    {
        new AppSetting { Key = "Site.MaintenanceMode", Value = "false", Description = "Global maintenance mode toggle (true/false)" },
        new AppSetting { Key = "Site.MaintenanceEndDate", Value = "", Description = "Optional end date for maintenance (ISO 8601 string)" },
        new AppSetting { Key = "Origin.AllowedOrigins", Value = "http://localhost:3000,http://localhost:3001,http://167.71.66.188:3000,http://178.62.192.74:3000,https://nexclone.com", Description = "Comma-separated list of allowed origins for CORS" },
        new AppSetting { Key = "Affiliate.CreditRewardReferrer", Value = "50", Description = "Credits given to the referrer" },
        new AppSetting { Key = "Affiliate.CreditRewardReferred", Value = "50", Description = "Credits given to the referred user" },
        new AppSetting { Key = "Affiliate.CashCommissionPercentage", Value = "20", Description = "Percentage of cash commission for affiliates (0-100)" }
    };

    foreach (var setting in defaultSettings)
    {
        if (!dbContext.AppSettings.Any(s => s.Key == setting.Key))
        {
            dbContext.AppSettings.Add(setting);
        }
    }

    // Ensure AllowedOrigins always includes the current server IPs (upsert)
    var originsKey = "Origin.AllowedOrigins";
    var existingOrigins = dbContext.AppSettings.FirstOrDefault(s => s.Key == originsKey);
    if (existingOrigins != null)
    {
        var requiredOrigins = new[]
        {
            "http://localhost:3000", "http://localhost:3001",
            "http://167.71.66.188:3000", "http://178.62.192.74:3000",
            "https://dev.169.58.204.169.nip.io",
            "https://api.169.58.204.169.nip.io"
        };
        var currentList = existingOrigins.Value.Split(',').Select(o => o.Trim()).ToList();
        bool changed = false;
        foreach (var origin in requiredOrigins)
        {
            if (!currentList.Contains(origin))
            {
                currentList.Add(origin);
                changed = true;
            }
        }
        if (changed)
        {
            existingOrigins.Value = string.Join(",", currentList);
        }
    }

    dbContext.SaveChanges();

    // Seed API Configs
    var defaultApiConfigs = new[] { "CrunAI" };
    foreach (var provider in defaultApiConfigs)
    {
        if (!dbContext.ApiConfigurations.Any(c => c.ProviderName == provider))
        {
            dbContext.ApiConfigurations.Add(new NexClone.Backend.Core.Entities.ApiConfiguration
            {
                ProviderName = provider,
                IsActive = true,
                ApiKey = provider == "CrunAI" ? (builder.Configuration["ApiKeys:CrunAI"] ?? "") : "" // default
            });
        }
    }
    dbContext.SaveChanges();

    // Seed Tools
    var toolsToSeed = new[] { "kling_avatar_image2video", "vidu_advanced_lip_sync", "advanced-lip-sync", "lip-sync", "lipsync" };
    foreach (var tool in toolsToSeed)
    {
        var existingConfig = dbContext.ToolConfigurations.Include(t => t.RoutingRules).FirstOrDefault(t => t.ToolName == tool);
        if (existingConfig == null)
        {
            var config = new NexClone.Backend.Core.Entities.ToolConfiguration
            {
                ToolName = tool,
                IsActive = true,
                RoutingRules = new List<NexClone.Backend.Core.Entities.ToolRoutingRule>
                {
                    new NexClone.Backend.Core.Entities.ToolRoutingRule
                    {
                        ProviderName = (tool == "kling_avatar_image2video") ? "Picsart" : "CrunAI",
                        ModelName = (tool == "kling_avatar_image2video") ? "kling-v1" : "vidu/lip-sync",
                        QualityLevel = "Standard"
                    }
                }
            };
            dbContext.ToolConfigurations.Add(config);
        }
        else
        {
            if (!existingConfig.RoutingRules.Any())
            {
                existingConfig.RoutingRules.Add(new NexClone.Backend.Core.Entities.ToolRoutingRule
                {
                    ProviderName = (tool == "kling_avatar_image2video") ? "Picsart" : "CrunAI",
                    ModelName = (tool == "kling_avatar_image2video") ? "kling-v1" : "vidu/lip-sync",
                    QualityLevel = "Standard"
                });
            }
            else if (tool != "kling_avatar_image2video")
            {
                foreach (var rule in existingConfig.RoutingRules)
                {
                    rule.ProviderName = "CrunAI";
                    rule.ModelName = "vidu/lip-sync";
                }
            }
        }
    }
    dbContext.SaveChanges();

    // Fix for existing CometAPI configs
    var existingKlingRules = dbContext.ToolRoutingRules.Include(r => r.ToolConfiguration).Where(r => r.ProviderName == "CometAPI" && (r.ToolConfiguration.ToolName == "kling_avatar_image2video" || r.ToolConfiguration.ToolName == "kling_advanced_lip_sync")).ToList();
    foreach(var r in existingKlingRules)
    {
        r.ProviderName = "Picsart";
    }
    dbContext.SaveChanges();

    // Seed New AI Tools
    var newToolsToSeed = new[] { "text-to-video", "image-to-video", "reference-to-video", "text-to-image" };
    var defaultJsonConfig = "{ \"grok\": { \"IsPerSecond\": true, \"BaseCost\": 0, \"CostPerSecond\": { \"default\": 2.0, \"480p\": 2.4, \"720p\": 4.5, \"1080p\": 8.0 } }, \"veo\": { \"IsPerSecond\": false, \"FixedCost\": { \"default\": 30, \"720p\": 30, \"1080p\": 37.5, \"4k\": 90 } } }";

    foreach (var tool in newToolsToSeed)
    {
        if (!dbContext.ToolConfigurations.Any(t => t.ToolName == tool))
        {
            var config = new NexClone.Backend.Core.Entities.ToolConfiguration
            {
                ToolName = tool,
                IsActive = true,
                AllowPremiumCredits = true, // Use premium for video
                AllowStandardCredits = true,
                AdditionalSettings = defaultJsonConfig,
                RoutingRules = new System.Collections.Generic.List<NexClone.Backend.Core.Entities.ToolRoutingRule>
                {
                    new NexClone.Backend.Core.Entities.ToolRoutingRule
                    {
                        ProviderName = "CrunAI",
                        ModelName = "default",
                        QualityLevel = "Standard"
                    }
                }
            };
            dbContext.ToolConfigurations.Add(config);
        }
    }
    dbContext.SaveChanges();
    
    // Seed new dedicated tool settings & models
    await NexClone.Backend.DbSeeder.SeedToolTablesAsync(app.Services);
}
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}

app.MapOpenApi();
app.MapScalarApiReference();

// app.UseHttpsRedirection(); // Commented out to prevent warnings since Railway handles HTTPS termination
app.UseStaticFiles();
app.UseRouting();

var supportedCultures = new[] { "en", "ar" };
var localizationOptions = new RequestLocalizationOptions()
    .SetDefaultCulture(supportedCultures[0])
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures);

// Read from AdminLang cookie
localizationOptions.RequestCultureProviders.Insert(0, new Microsoft.AspNetCore.Localization.CookieRequestCultureProvider
{
    CookieName = "AdminLang"
});

app.UseRequestLocalization(localizationOptions);

app.UseCors("AllowNextjs");
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllers();

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapHealthChecks("/health");
app.MapHub<NexClone.Backend.Hubs.TicketHub>("/hubs/ticket");
app.MapHub<NexClone.Backend.Hubs.NotificationHub>("/hubs/notification");

// Register Affiliate Commission Hold Job — runs daily at midnight
using (var hangfireScope = app.Services.CreateScope())
{
    var recurringJobManager = hangfireScope.ServiceProvider.GetRequiredService<Hangfire.IRecurringJobManager>();
    recurringJobManager.AddOrUpdate<NexClone.Backend.Application.BackgroundJobs.AffiliateCommissionHoldJob>(
        "affiliate-commission-hold",
        j => j.ProcessAsync(),
        Hangfire.Cron.Daily);
}

app.Run();
