# NexClone / NexMedia AI — Project Reference (End-to-End Analysis)

> Generated: 2026-08-26 · Updated: 2026-08-26 (clicks removal, AssignPlan fix, Veo Quality removal, local stack, affiliate E2E) · `C:\Users\solo\Desktop\nexcole\nexclone`
> Product: "NexMedia" — bilingual (EN/AR, RTL-first) AI content-creation platform (TTS/STT/video/image tools), clone of Nexcole.

---

## 1. Architecture Overview

| Layer | Stack |
|---|---|
| **Backend** | ASP.NET Core **net10.0** MVC+API hybrid (`NexClone.Backend`), EF Core + PostgreSQL (Npgsql), ASP.NET Identity w/ custom Django PBKDF2 password hasher, JWT-in-cookie auth (users) + cookie role auth (admins) |
| **Jobs/Queue** | **Hangfire on Postgres** (`Hangfire.PostgreSql`) — 7 named queues; 2 hosted `BackgroundService`s + 1 recurring job. No RabbitMQ/MassTransit despite `Consumers/` folder naming |
| **Realtime** | SignalR hubs `/hubs/notification`, `/hubs/ticket`; user mapping via `NameIdentifierUserIdProvider` |
| **Storage** | MinIO / S3-compatible object storage (`S3MediaService`; presigned GET 7d / PUT 1h) |
| **Frontend** | Next.js 16 App Router, React 19, TS strict, zustand (10 stores), next-intl (`en`/`ar`, default `ar`), axios w/ single-flight token refresh, `@microsoft/signalr`, R3F/three/drei, framer-motion, Tailwind v4 |
| **Infra** | Prod: `docker-compose.yml` — Traefik (TLS) + Postgres 15 + Redis 7 + MinIO (:9001/:9002) + backend (:8080) + frontend (:3000). Domain: nexmediaai.com |
| **Local Dev** | `docker-compose.local.yml` — infra only: postgres **:5433**, minio **:9101** API / **:9102** console, redis :6379 (volumes suffixed `_local`). Backend runs as container `nexclone-local-api` on **http://localhost:5050** (`docker run` of image `nexclone-backend-local`); frontend native on :3000 (`.env.local` → :5050). ⚠️ Windows **Smart App Control blocks freshly-built DLLs** → native `dotnet run` fails with 0x800711C7; Docker-run is the workaround. Host :5000 is occupied by another project's container |
| **Observability** | Serilog (+correlation IDs), Prometheus `/metrics`, health `/health`, OpenAPI + Scalar UI, Hangfire dashboard `/hangfire` |

### Startup pipeline order (Program.cs)
ForwardedHeaders → CorrelationId → RequestDuration → HttpMetrics → env exception handling/HSTS → OpenAPI/Scalar → StaticFiles → Routing → RequestLocalization (en/ar; `AdminLang` cookie provider) → CORS `AllowNextjs` (AllowCredentials) → RateLimiter → Authentication → Authorization → MapControllers → Hangfire dashboard → `/health` → SignalR hubs. HTTPS redirection disabled (TLS upstream).

### Auth model
- **API users**: JWT HS256 (15-min), issuer `NexClone.Backend`, audience `NexClone.Frontend`, read from HttpOnly `jwt` cookie via JwtBearer `OnMessageReceived`. Refresh token: 64-byte random, 15-day expiry, rotation-on-use w/ revocation chain.
- **Admins**: separate `AdminAuthCookie` scheme, Roles=Admin, 7-day persistent, login at `/AdminAuth/Login`.
- Identity lockout: 20 attempts / 15 min. DataProtection keys persisted to DbContext.
- Rate limiting (per-IP fixed window): `ApiPolicy` 100 req/min, `AuthPolicy` 30 req/min → HTTP 429.

---

## 2. Contacts & Support Flows — Current State

> **There is NO dedicated Contacts API.** A case-insensitive sweep of the backend found zero contact endpoints/controllers/DTOs/services. Only traces: a `contact-us` CMS slug option in admin views (`Views\CustomPagesAdmin\Create.cshtml:17`) and an unrelated seeded email in `SeedData\legacy_users.sql`.

Three paths serve "contact" today:

| Path | Mechanism | Scenarios handled |
|---|---|---|
| `/support` page | `POST api/Tickets` `{subject,message}` | success → ticket + first message created, list refreshed; blank subject/message → 400; error banner from `response.data.message` |
| Ticket thread | `POST api/Tickets/{id}/message` (multipart) | closed ticket → 400; attachment whitelist `.jpg,.jpeg,.png,.pdf,.zip,.rar` else 400; reopens ticket to Open; admin reply broadcasts SignalR `ReceiveMessage` to group `ticket_{id}` |
| Footer "Contact Us" link | `/pages/contact-us` → server fetch `GET api/platform/custom-page/{slug}` | missing slug → `notFound()`; renders bilingual admin-authored HTML |

Ticket rules: own-only access (else 404), PII stripped from senders, attachment URLs presigned, status flow Open→InProgress→Closed.

Missing scenarios if a real Contact API is ever built: anonymous submission, spam/rate limiting, duplicate suppression, admin notification email, persistence model beyond tickets, retention policy.

---

## 3. Complete API Surface — 43 Controllers

Legend: **JWT** = `[Authorize]` default scheme; **Admin** = cookie scheme + Roles="Admin"; **Anon** = anonymous.

### 3.1 Root-level
| Controller | Route | Notes |
|---|---|---|
| `InvoicesController` | `api/Invoices` | `GET verify/{token}` Anon — **stub returning 404** (verification feature removed 2026-08-26), `GET my-invoices` JWT, `GET generate-retro` Admin |
| `WebhooksController` | `api/webhooks` | Anon + signature checks: Paymob HMAC-SHA512 constant-time verified; PayPal PAYMENT.CAPTURE.COMPLETED (**signature NOT verified — TODO**); unauth `mock-payment` seeder. Idempotent activation, refunds/reversals |

### 3.2 Client JSON API (`API\Controllers\Client\`)
| Controller | Route | Highlights / scenarios |
|---|---|---|
| `AuthController` | `api/Auth` | register (dup-email 400 distinct verified/unverified msgs; kickbox disposable-domain check; device-fingerprint free-trial anti-abuse; referral linking via refCode or aff_session cookie; Hangfire email), login (401 x4 reasons incl. lockout countdown payload; sets `jwt`+`refreshToken` HttpOnly SameSite=None cookies), Google login (DB-stored client id), forgot-password (neutral 200 anti-enumeration), reset-password (Base64URL token), `me` (lazy sub transition active→freeze/expired via GracePeriodDays, wallet reset, avatar signing, full profile + plan permissions) |
| `TokenController` | `api/auth` | refresh-token rotation (revoke old, record ReplacedByToken, reissue cookies), logout, logout-all (JWT) |
| `VerificationController` | `api/auth` | verify-email, resend-verification (404 unknown, 400 already verified, **429 cooldown <5min** via LastVerificationEmailSentAt), GET resend-cooldown `{Allowed,RemainingSeconds}` |
| `PhoneController` | `api/auth/add-phone` | dup phone 400 / taken-by-other 400; fingerprint; grants default/free plan if no active sub; queues receipt email |
| `ProfileController` | `api/profile` | multipart update FullName/Country/avatar→MinIO `profiles/{userId}/...`; change-password (400 generic fail) |
| `TicketsController` | `api/Tickets` | list own desc UpdatedAt; create (400 blanks); detail own-only else 404 (signed attachments, PII stripped); reply multipart (400 closed ticket; ext whitelist; reopens to Open) |
| `BlogController` | `api/Blog` | published posts w/ signed media; post detail anonymized comment authors; add comment (JWT; 400 empty; 404 unpublished) |
| `HistoryController` | `api/History` | scoped list/detail/delete; URL signing; redacts ResultText for tts/i2v/lipsync rows, nulls ErrorMessage |
| `CheckoutController` | `api/checkout` | gateways/{planId} Anon (plan-linked then global fallback; PayPal exposes ClientId); pay → IPaymentService.InitiatePaymentAsync (currency match validation else 400); create/capture PayPal order (capture activates sub, credits, commission, invoice PDF, email) |
| `ManualPaymentsController` | `api/ManualPayments` | methods Anon sorted by name; POST form+antiforgery (400 invalid plan / missing receipt / **duplicate pending**; upload to `receipts`; Payment Pending/Manual; 500 storage failure) |
| `MediaController` | `api/Media` | presigned PUT upload-url; content-type + extension whitelists else 400; key `private/{userId}/{tool}/{yyyy-MM}/{guid}_{file}` |
| `PlatformController` | `api/Platform` | public catalog: stats, tools-config, plans (excludes deleted/default-registration), voices (signed demo audio), dialects, emotions, styles, tts-config (per-plan allowed voices when authed), vtt-config, payment-methods, social-links, custom-page/{slug} (404 missing) |
| `SettingsController` | `api/Settings` | public: maintenance flag/end date, Google clientId, per-method payment statuses (suspended/maintenance/comingSoon) |
| `AffiliateController` | `api/affiliate` | ApiPolicy rate-limited; profile (404 not onboarded; **no totalClicks**), onboard, balances, stats (**totalSignups/paidCustomers/activeSubscriptions/conversionRate = paid÷signups**), referrals paged (emails masked; **joinedAt**), commissions paged, payouts request (DTO Amount/Currency/PayoutMethod/PayoutAccount/Message; 400 invalid amount etc.), payouts list w/ signed receipts |
| `AffiliateTrackController` | `api/affiliate-track/click` | Anon + ApiPolicy; records click, returns session token; 400 missing code |

### 3.3 AI Job API (`API\Controllers\AI\`) — shared pattern
validate → `UsagePolicyService.ValidateAndChargeAsync` (optimistic-concurrency retry x3) → persist `GenerationHistory(status=processing)` → enqueue Hangfire consumer → return `{taskId,status:"processing",standardCredits,premiumCredits}`; refund credits on queueing exception (500).

| Controller | Route | Endpoints |
|---|---|---|
| `TextToVoiceController` | `api/ai/text-to-voice` | generate (TTS-disabled check; max length from settings; voice validity + plan-allowed-voice check; DTO Text/Language/VoiceName/StyleInstruction/Quality Standard|High/SubscriptionId), estimate |
| `VoiceToTextController` | `api/ai/voice-to-text` | transcribe (downloads from MinIO; size cap MaxAudioFileSizeMb=25MB; TagLib duration fallback; cap MaxAudioDurationMinutes=10; rounds up minutes; Translate+TargetLanguage), estimate |
| `VideoController` | `api/video` | estimate-avatar/lipsync (per-second vs 5s-block), start-avatar (plan image/audio size + prompt limits), start-lipsync (TagLib duration; plan MaxDurationSeconds), status/{taskId} (local → CometAPI fallback which auto-refunds failed tasks), estimate-motion-control, estimate-tool/{toolType}, pricing/{toolType} Anon, start-motion-control, start-tool/{t2v|i2v|r2v} (up to 3 images), download-proxy Anon (SSRF allowlist kling/google/amazonaws...) |
| `ImageController` | `api/image` | estimate-tool/text-to-image, pricing/text-to-image Anon, start-tool/text-to-image (prompt required AR-error; grok default), status/{taskId} |
| `VoicesController` | `/Voices` MVC | Admin cookie; voice catalog listing view |

### 3.4 Admin MVC controllers (cookie auth, Roles=Admin)
| Controller | Route | Key operations |
|---|---|---|
| `AdminAuthController` | `/AdminAuth` | Login POST (IsStaff gate; claims Role=Admin; 7-day persistent), Logout, AccessDenied, SwitchLang (culture cookie) |
| `UsersController` | `/Users` | Index search/paginate; Details (devices/affiliate/payments/lockout); Create (auto default plan + receipt email); **AssignPlan** (same plan → extend + cancel any other stacked subs; different plan → cancel ALL other active/frozen subs then create new — no more duplicate subscriptions; then credits, Payment record, affiliate commission, invoice PDF, receipt email); AdjustCredits; ExtendSubscription; ChangePassword; UnlockUser; Edit/Delete/BulkDelete (**all-or-nothing**: DB transaction + per-user pre-cleanup of blog comments/ticket messages; first blocking record → rollback everything + HTTP 409 `{message}` naming affiliate/commission-ledger cause; view alerts the server message); AddCreditAmount; UpdateSubscriptionDates; UpdateAffiliateTrackingDates |
| `SubscriptionsController` | `/Subscriptions` | Index filters; Details; UpdateEndDate (recalc freeze/expired, wallet reset on expiry, grace/expired email); Delete; BulkDelete |
| `PlansAdminController` | `/PlansAdmin` | Plan CRUD (USD/EGP, tax vs fixed-fee mutual exclusion, single-default enforcement); soft delete; ManageGateways/AddGateway (clears other defaults per currency)/RemoveGateway/ToggleGateway; **seed endpoint is [AllowAnonymous] at bare action route `GET /seed-test-plans`** (not /PlansAdmin/SeedTestPlans) — publicly seeds paid plans |
| `PaymentsAdminController` | `/PaymentsAdmin` | Paginated payments; Details w/ linked invoice + PDF URL |
| `ManualPaymentsAdminController` | `/ManualPaymentsAdmin` | Pending list; Details signed receipt; **Approve** (extends/creates sub, cancels competing subs, wallet credits, tax math, invoice+PDF upload, Hangfire receipt email); Reject |
| `ManualPaymentMethodsAdminController` | `/ManualPaymentMethodsAdmin` | Bank/wallet instruction CRUD |
| `PaymentConfigAdminController` | `/PaymentConfigAdmin` | Gateway config CRUD; single-active-per-provider enforcement |
| `ApiConfigAdminController` | `/ApiConfigAdmin` | Provider API key CRUD (Brevo, CrunAI, ...) |
| `ToolConfigAdminController` | `/ToolConfigAdmin` | 8 canonical tools; lazy-seeds settings/pricing tables; SaveConfig parses ModelCosts/model keys into JSON AdditionalSettings, rebuilds ToolRoutingRules, syncs dedicated tables, writes `Concurrency_{tool}` AppSetting |
| `MailingAdminController` | `/MailingAdmin` | Brevo settings; template CRUD; SendMail broadcast ALL users fire-and-forget Task.Run loop when TargetUserEmail empty |
| `LogsAdminController` | `/LogsAdmin` | Tails newest logs/system*.log last 1000 lines; ClearLogs truncates |
| `HistoryAdminController` | `/HistoryAdmin` | Search/filter top 1000 + stats counters; Details signed URL; Delete |
| `BlogAdminController` | `/BlogAdmin` | Post CRUD (file upload priority over URL); Comments; ReplyComment (IsAdminReply); DeleteComment |
| `CustomPagesAdminController` | `/CustomPagesAdmin` | CMS pages CRUD (Slug, TitleEn/Ar, ContentEn/Ar); contact-us slug option in views |
| `AffiliateAdminController` | `/AffiliateAdmin` | Overview stats; Affiliates search/paged w/ conversion rates; Details; UpdateCommissionStatus; PayoutRequests filter; ViewReceipt redirect signed URL; UpdatePayoutStatus state machine (uploads payout receipt when Paid); AffiliateSettings |
| `SystemUpdatesAdminController` | `/SystemUpdatesAdmin` | Changelog entries CRUD (bilingual) |
| `TicketsAdminController` | `/TicketsAdmin` | Index; Chat(id); UpdateStatus; SendMessage (antiforgery; attachment upload; IsAdminMessage; Open→InProgress; SignalR group broadcast) |
| `SettingsAdminController` | `/SettingsAdmin` | AppSettings key/value editing; tools maintenance toggles |

---

## 4. Data Models / Objects (~40 entities)

### Identity & Auth
| Entity | Key properties |
|---|---|
| `ApplicationUser` | extends `IdentityUser<Guid>`: FullName, Country, IsVerified, LastVerificationEmailSentAt, ImageUrl, IsActive, IsStaff, IsSuperAdmin, VisibleAdminSections (CSV), **dual wallets StandardCredits + PremiumCredits (decimal, concurrency tokens)**, CreatedAt |
| `RefreshToken` | Token, ExpiresAt, CreatedByIp, revocation chain (IsRevoked/RevokedAt/RevokedByIp/ReplacedByToken), computed IsActive |
| `EmailVerification` | Token, IsUsed, CreatedAt |
| `UserPhoneNumber` | PhoneNumber, TermsAccepted(At); 1:1 unique UserId |
| `DeviceFingerprint` | IpAddress, UserAgent, FingerprintHash — free-trial & self-referral fraud checks |
| `AuthModels.cs` | RegisterRequest, LoginRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest, AddPhoneRequest, VerifyEmailRequest |

### Billing
| Entity | Notes |
|---|---|
| `Plan` | Bilingual Name/Description/Features; DurationDays, GracePeriodDays (3); PriceUsd/PriceEgp + tax % + fixed fees per currency; credit grants MonthlyCredits(legacy)/StandardCredits/PremiumCredits; 9 tool-access booleans; IsFreeTrial, AllowedVoices CSV, IsDefaultRegistrationPlan; affiliate commission config (first + recurring, Fixed/Percentage); soft delete IsDeleted |
| `Subscription` | StartDate/EndDate; Status stored lowercase string ↔ enum helper (Active/Freeze/Expired/Canceled) |
| `Payment` | External PaymentId, Amount, Currency USD/EGP, Method, Status, ReceiptUrl; FK User cascade / Plan-Subscription SetNull |
| `Invoice` | InvoiceNumber, gateway, method, transaction id, SubTotal/Tax/FixedFee/Total, MinioPdfUrl, VerificationToken |
| `PaymentGatewayConfig` | Per-provider DB credentials: Paymob (PublicKey/SecretKey/HmacSecret/IntegrationId/WalletIntegrationId/IframeId), PayPal (ClientId/ClientSecret/ApiBase); IsActive |
| `PlanPaymentGateway` | Plan↔Gateway pivot: Currency, DisplayName, IsDefault, SortOrder, IsActive |
| `ManualPaymentMethod` | Name, AccountDetails, Instructions, IsActive |

### AI tool settings + pricing (pattern x8)
Each tool has a singleton settings row (`Id=1`, no auto-gen) and a pricing row set implementing `IModelPricingEntity { ModelName, ProviderName, AllowedWallet: Standard|Premium|Both, IsActive, BaseCost }`:

| Settings | Pricing cost fields |
|---|---|
| `TextToVoiceSetting` (+fallback-routing counters) | `CostPerChar` by QualityLevel Standard/High (Gemini default 0.001) |
| `VoiceToTextSetting` (25MB / 10min caps) | `CostPerMinute`=1.0 / `CostPerSecond`=0.0167 |
| `TextToVideoSetting` | per-second costs x4 resolutions (480p 2.4 → 4K 15.0) or FixedCost per request (20→90) |
| `ImageToVideoSetting` | same resolution matrix |
| `LipSyncSetting` (video<=100MB, audio<=25MB/120s) | `CostPerSecond`=0.5 (+per-5s-block mode) |
| `MotionControlSetting` | BillingType FlatRate CostPerGeneration=20 + CostPerSecond=2 |
| `TextToImageSetting` | CostPerImage=4.0 (grok-imagine/CrunAI) |
| `AvatarToVideoSetting` | UnitCost=10, PerRequest/PerSecond modes |

### Platform / ops
`ToolConfiguration` (IsActive/IsMaintenanceMode/IsComingSoon, wallet gating booleans, jsonb AdditionalSettings), `ToolRoutingRule` (QualityLevel→Provider/Model, time windows, MaxDailyRequests/MaxRequestsPerMinute), `GenerationHistory` (universal job record: Type/Status processing-completed-failed/FileUrl/InputText/ResultText/CreditsUsed/ErrorMessage), `ApiConfiguration` (provider keys), `AppSetting` (key/value store incl. S3 creds, CORS origins, Affiliate.* keys), `EmailTemplate`, `SystemUpdate`, `CustomPage` (Slug + En/Ar content), `BlogPost/BlogComment` (IsAdminReply flag), `SupportTicket/TicketMessage` (Open/InProgress/Closed; AttachmentUrl/Type; IsAdminMessage).

### Affiliate — immutable ledger design
> **2026-08-26**: Clicks removed system-wide. `TrackClickAsync`/manual-link still create `AffiliateReferral` sessions + tokens (attribution backbone), but **`TotalClicks` is never incremented** — column retained but dead (no migration needed). Conversion rate = paid customers ÷ referred signups.

| Entity | Design |
|---|---|
| `AffiliateProfile` | AffiliateDisplayId "AF-{id:D5}", unique ReferralCode, TotalClicks *(dead since clicks removal)*, onboarding contacts, PolicyAcceptedAt |
| `AffiliateReferral` | Click-tracking per visitor session: SessionToken cookie, AttributionExpiresAt, HasConverted, ReferredUserId SetNull |
| `AffiliateCommission` | **Append-only ledger**: Type FIRST_PURCHASE/RECURRING/REVERSAL; Status PENDING/AVAILABLE/CANCELLED/REVERSED/PAID; AvailableAt hold; six Restrict FKs; currency never converted |
| `AffiliatePayout` | Manual withdrawals PENDING→APPROVED→PROCESSING→PAID / REJECTED / FAILED; TransferReceiptUrl |

### Catalogs (JSON, not EF)
`TtsCatalogService` singleton loads `Data\Catalogs\tts_voices.json`, `tts_dialects.json`, `tts_emotions.json`, `tts_styles.json` (`VoiceCatalogItem`, `OptionCatalogItem`); validates uniqueness at startup.

### Data layer
- **DbContext**: `ApplicationDbContext` (Identity + IDataProtectionKeyContext) split into partials under `Infrastructure\Data\ContextPartials\`: Identity, Subscriptions, AiTools, Content, Support, Affiliate.
- Wallet credits configured as EF concurrency tokens.
- **Migrations**: single baseline `20260822_InitialCreateBaseline`; runtime raw-SQL guards in `DbSeeder.SeedToolTablesAsync` patch schema drift.
- **Seeding** (`DbSeeder.SeedAllAsync` at startup): AppSettings defaults → CrunAI ApiConfiguration → ToolConfigs+routing rules → raw-SQL table guards + pricing rows → legacy users SQL (~1513 lines, only if Users<10) → roles SuperAdmin/Staff/User + 2 hard-coded super-admins.

---

## 5. AI Tools (9) & Credit Engine

Video tool model catalogs (t2v / i2v / r2v): **Veo 3.1 Fast · Veo 3.1 Lite · Grok Imagine**. "Veo 3.1 Quality" was fully removed (2026-08-26): frontend MODELS arrays ×3, `DbSeeder` seeds + idempotent cleanup deleting existing rows, `ToolConfigAdminController` lazy-seed + SaveConfig defaults, `Edit.cshtml` pricing panels, and `VideoToolConsumer.ResolveModelId` (**bare `"veo"`/`"veo-3.1"` aliases now resolve to Fast, never Quality** — closes an estimate≠charge trap).

**Frontend estimate display policy**: no client-side price guessing. t2v/i2v/r2v show backend value or "—" on API failure (silent-catch stale `37.5` removed); motion-control fake `3`/`5` fallbacks removed (backend FlatRate charges 20); lip-sync wrong `blocks×1` fallback removed (backend Per5Seconds ≈12/block); pricing-merge effects spread `{...m.prices}` so no resolution key is dropped.

Tools: TTS · STT · Text-to-Video · Image-to-Video · Reference-to-Video · Lip-Sync · Motion-Control · Text-to-Image · Avatar-Video.

**Charging engine** — `UsagePolicyService` (377 lines):
1. Tool enabled check via effective permissions
2. Block frozen accounts / free-plan freeze
3. Cost math via strategy pattern `ToolCostCalculatorFactory` (8 calculators matched by ToolIds arrays): per-char, per-minute, per-second-per-resolution, flat-rate, per-image, block-based lipsync
4. Split charge Standard-first then Premium honoring tool wallet gates (`AllowStandardCredits`/`AllowPremiumCredits` + row AllowedWallet)
5. Debit with DbUpdateConcurrencyException retry x3 + SignalR `ReceiveWalletUpdate` push
6. RefundAsync / RefundByToolAsync on failure; EstimateCostAsync for pre-flight estimates; voice-to-text byte-size special conversion; NormalizeModelKey fuzzy matching

**Permission resolution** — `SubscriptionPermissionService`: supports stacked subscriptions; OR of 9 tool flags, UNION of AllowedVoices, IsFrozenDueToFreePlanOnly when all active plans are free/trial ($0 or name contains "free").

---

## 6. Background Jobs & Consumers

### Hosted services (`Application\BackgroundJobs\`)
| Job | Schedule | What it does |
|---|---|---|
| `SubscriptionStatusService` | hourly timer | active→freeze past EndDate (Arabic grace email via Hangfire), freeze→expired after grace (expiry email + wallet reset via WalletService if no other active sub) |
| `MediaCleanupService` | daily timer | deletes generated media >14 days from MinIO in batches of 100 (also input files in InputText), clears FileUrl, sets Status=expired |

### Hangfire recurring
`affiliate-commission-hold` — Cron.Daily midnight UTC → `AffiliateService.ProcessPendingCommissionsAsync()` (PENDING→AVAILABLE after `Affiliate.HoldPeriodDays`, default 14). Dashboard trigger requires its antiforgery flow (scripted tests replicate the transition via the same state change).

### Hangfire server config
Postgres storage; workers = CPU cores x5; queues: `default, avatar_video_queue, lipsync_queue, tts_queue, vtt_queue, motion_control_queue, email_queue`. Consumers registered scoped.

### Consumers (`Infrastructure\Consumers\`) — Hangfire job handlers, NOT MassTransit
Shared base `BaseAiTaskConsumer`: polling w/ exponential backoff (5s base, max 30s, max 45 attempts) against CometAPI/Picsart/CrunAI; tool config resolution (ToolConfigurations + routing rules + ApiConfigurations); SignalR NotifyUserSuccess/Failed.

| Consumer | Queue | Provider | Failure behavior |
|---|---|---|---|
| `AvatarVideoConsumer` | avatar_video_queue | Picsart Kling image2video | mark failed + refund + notify |
| `LipSyncConsumer` | lipsync_queue | CrunAI (Vidu lip-sync) | same |
| `MotionControlConsumer` | motion_control_queue | Picsart kling_motion_control workflows | same |
| `VideoToolConsumer` | default | CrunAI (Veo 3.1 t2v/i2v/r2v, Grok Imagine fun/normal/spicy) | same |
| `ImageToolConsumer` | default | CrunAI grok-imagine/t2i | same |
| `TtsConsumer` | tts_queue | Gemini via ITtsService; uploads WAV to MinIO | RefundAsync standard/premium + notify |
| `VttConsumer` | vtt_queue | OpenAI via ISttService (+optional translate) | refund + notify |
| `EmailConsumer` | email_queue | Brevo | rethrow → Hangfire retry |

---

## 7. External Integrations

| Domain | Providers |
|---|---|
| **AI** | Google **Gemini** TTS (`gemini-3.1-flash-tts-preview` / 2.5 fallbacks; quota-based primary→fallback routing; PCM→WAV), **OpenAI** STT/translation (`gpt-4o-mini-transcribe`, whisper-1 fallback), **CrunAI** gateway (video/image/lipsync: Veo3.1, Grok, Vidu models), **CometAPI** (legacy Kling avatar path), **Picsart** (avatar video + motion control workflows) |
| **Payments** | **Paymob Intention API** (EGP; cents; card+wallet integrations; unified checkout redirect; HMAC-SHA512 webhook), **PayPal Orders v2** (USD; OAuth2 client credentials; capture flow; webhook signature TODO). Paymob service routes USD → PayPal |
| **Invoicing** | QuestPDF A4 tax invoices + "paid" stamp asset. *(Invoice verification — QR code, `QRCoder`, verify endpoint, `/verify-invoice/[token]` page, `verifyUrlBase` plumbing — fully removed 2026-08-26; `Invoice.VerificationToken` column retained but dead)* |
| **Email** | **Brevo API** (`BrevoEmailService` direct) behind `QueueEmailService` decorator that enqueues EmailConsumer via Hangfire; RTL Arabic templates by `EmailTemplateService` (receipt/grace/expired/verification/reset/completed) |
| **Storage** | MinIO/S3 via Minio SDK; config precedence env vars → DB AppSettings (5-min cache) → hardcoded defaults |
| **Misc** | kickbox.com disposable-email screening at registration; Google ID-token validation (`Google.Apis.Auth`); TagLibSharp media duration; FingerprintJS (frontend) |

---

## 8. Frontend Map

### Routes (`app\[locale]\`)
home · login · register · forgot-password · reset-password · verify-email · complete-profile (phone capture) · free-trial · pricing · payment/success (PayPal capture redirect; manual pending state) · verify-invoice/[token] · history (+[id]) · profile (+tickets, tickets/[id] SignalR chat, invoices, history/[id]) · affiliate-program (marketing) · affiliate (dashboard: overview/referral link/referrals/earnings/withdrawals) · blog (+[id]) · support (**contact form**) · privacy · pages/[slug] (CMS) · tools hub + 8 workspaces (text-to-video, image-to-video, reference-to-video, text-to-image, advanced-lip-sync, motion-control, text-to-voice, voice-to-text) · robots.ts · sitemap.ts (hreflang en/ar)

Pattern: tiny server `page.tsx` wrapper rendering `"use client"` `Client.tsx`. Tools layout chain: `ToolsSidebar` → guards `ToolsAuthGuard` (→login/complete-profile) → `ToolStatusGuard` (maintenance/coming-soon screens) → `OnboardingTour`.

### Components
- Root: CostEstimateCard, GoogleAuthProviderWrapper, GoogleLoginButton, MaintenanceScreen, MediaTrimmer, ToolInstructions
- src/components: Navbar (450 lines, lang switcher, FreezeWarningBanner), Footer, MobileBottomNav, HeroSection, ToolsSection, FeaturesSection, HowItWorks, PricingSection, TestimonialsSection, CTASection, MarqueeBanner, AnimatedText, CursorGlow, Scene (R3F; unreferenced outside test), AuthSessionProvider (bootstraps `/api/auth/me`, handles `auth:unauthorized`), CheckoutModal (870 lines: gateways/PayPal/manual receipt upload), ToolsSidebar (604 lines), ToolTutorial
- affiliate/ (8): Overview, StatsGrid *(no Clicks card)*, ReferralLink *(shows Member Since instead of clicks)*, ReferralsTable *("Joined" column via joinedAt)*, CommissionsTable, WithdrawalForm, PayoutsTable, OnboardingForm
- modals/: LogoutModal (this device vs all devices)
- profile/ (6): HeaderCard, Overview, History, Subscription, Settings (avatar upload, change password), Support
- dashboard/: OnboardingTour

### Zustand stores (in-memory, no persist; session restored via API)
useAppStore (user/toolConfigs/sidebar/logout modal) · useAuthStore (login/register/googleLogin/verify/forgot/reset/addPhone/fetchMe/cooldown) · useAffiliateStore · usePlansStore · useHistoryStore (+invoices) · useTicketStore · useBlogStore · useProfileStore · useToolsStore (estimates/generation for all tools; updates credits in useAppStore)

### Utils & infra
- `api.ts`: axios, baseURL `NEXT_PUBLIC_API_URL` (fallback hard-coded nip.io), withCredentials, **single-flight refresh manager** on 401 (queues callers, replays with Bearer header, dispatches `auth:unauthorized` on failure)
- `endpoints.ts`: centralized API_ENDPOINTS registry
- `upload.ts`: presigned-PUT direct-to-MinIO upload (clean axios instance)
- `toolStatus.ts`: canonical tool-key mapping + status resolver
- lib/signalr-client.ts: singleton hub connection w/ auto-reconnect; ReceiveNotification + ReceiveWalletUpdate
- sw.ts Workbox service worker (layout actively unregisters SWs though)
- next.config.mjs rewrites: MinIO buckets + `/api/*` → `http://backend:8080/api/*` (Docker proxy); COOP headers; ignoreBuildErrors=true
- proxy.ts (Next 16 middleware replacement): wraps next-intl middleware; intercepts `?ref=` links → fire-and-forget affiliate click tracking → sets 30-day aff cookies → strips ref param

### i18n & data
locales en/ar (default ar); messages/en.json + ar.json identical trees; static bilingual blogData.ts (4 articles); Resources/{en,ar}.json on backend for MVC localization.

### Tests
48 Vitest unit files (components/stores/utils/pages incl. exact endpoint-binding assertions) + 7 Playwright e2e specs (home/auth/registration/billing/free-trial/profile/ai-tools; some Arabic strings mojibake-corrupted).

---

## 9. Realtime, Middleware & Cross-Cutting

SignalR events: `ReceiveNotification` (job success/failure), `ReceiveWalletUpdate` (credits change/refund), `ReceiveMessage` (ticket chat groups).
Middleware: CorrelationIdMiddleware (X-Correlation-Id ↔ Serilog LogContext), RequestDurationMiddleware (Prometheus histogram/counter/gauge), ForwardedHeaders (trusts any proxy), global CrudSuccessMessageFilter (TempData success msgs for MVC), antiforgery per-action on admin POSTs.
Health: PostgresHealthCheck SELECT 1 at `/health`.

---

## 10. Known Issues / Security Flags

**Fixed (2026-08-26):**
- ✅ AssignPlan duplicate subscriptions — now cancels competing active/frozen subs (§3.4)
- ✅ Video estimate≠charge traps — frontend price-guessing removed; `"veo"` alias no longer resolves to Quality model (§5)
- ✅ Users/BulkDelete 500 on affiliate users — all-or-nothing DB transaction, graceful 409 with explanatory message instead of raw 500 (§3.4)
- ✅ Invoice verification feature removed end-to-end — QR code + QRCoder dependency gone from PDFs; `verify/{token}` endpoint is a 404 stub; `/verify-invoice/[token]` frontend page deleted; `verifyUrlBase` plumbing removed from all 6 call sites (§7)

**Open:**
1. **No Contacts API** exists (see §2) — contact flows ride the ticket system + CMS pages
2. `POST api/webhooks/mock-payment` — **unauthenticated**, can fabricate subscriptions/commissions
3. `GET /seed-test-plans` is `[AllowAnonymous]` — publicly seeds paid plans
4. PayPal webhook signature NOT verified (explicit TODO at WebhooksController ~L548)
5. ~10 destructive admin POSTs lack `[ValidateAntiForgeryToken]`: Users.BulkDelete, Subscriptions.UpdateEndDate/Delete, PlansAdmin.RemoveGateway, HistoryAdmin.Delete, LogsAdmin.ClearLogs, BlogAdmin deletes, CustomPagesAdmin.Delete, ApiConfigAdmin.Delete, PaymentConfigAdmin.Delete
6. Hangfire dashboard mounted at `/hangfire` with **no authorization filter**
7. Hard-coded infrastructure IPs in frontend: `https://api.169.58.204.169.nip.io` (api/signalr/history fallbacks), `http://188.166.65.112:8080` (verify-invoice page bypasses axios baseURL)
8. Stale artifacts: `ToolsSidebar.tsx.orig/.rej`; orphaned `Views\Plans\`, `Views\SocialLinksAdmin\`; `Scene.tsx` unused
9. ForwardedHeaders trusts all proxies → per-IP rate-limit partition spoofable
10. MailingAdmin mass-mail uses fire-and-forget `Task.Run` loop (no batching/retry visibility)
11. **New findings**: `EmailVerifications` table is dead code — verification tokens are Identity-generated (`ConfirmEmailAsync`, never stored); affiliate `TotalClicks` DB column retained but never incremented; Hangfire dashboard recurring-job trigger requires antiforgery (scripted automation must replicate the state transition or drive the UI)

---

## 11. Quick Reference — Ports & URLs (Local)

| Thing | Value |
|---|---|
| Backend API (local, Docker) | **http://localhost:5050** (`nexclone-local-api` container) |
| Frontend dev | http://localhost:3000 (`.env.local` → :5050) |
| Postgres | localhost:**5433**, db `nexclone_dev`, user `nexclone` |
| Redis | localhost:6379 (pass `devredis123!`) |
| MinIO | localhost:**9101** API / **:9102** console (`devminioadmin`/`devminiosecret123!`) |
| Swagger/OpenAPI | Scalar UI via MapScalarApiReference |
| Metrics / Health / Jobs UI | /metrics · /health · /hangfire |
| Hubs | /hubs/notification · /hubs/ticket |
| Admin seed route | GET `/seed-test-plans` |

Prod (:5000/:8080/:9001-2 inside compose network) unchanged — see §1 Infra row.

---

## 12. Local Run & Affiliate E2E

### Start the local stack
```powershell
docker compose -f docker-compose.local.yml up -d          # postgres + minio + redis
docker build -t nexclone-backend-local ./NexClone.Backend
docker rm -f nexclone-local-api 2>$null
docker run -d --name nexclone-local-api -p 127.0.0.1:5050:8080 `
  -e ASPNETCORE_ENVIRONMENT=Development `
  -e "ConnectionStrings__DefaultConnection=Host=host.docker.internal;Port=5433;Database=nexclone_dev;Username=nexclone;Password=devpassword123!" `
  -e "Jwt__Key=<64+char dev key>" `
  -e S3_ENDPOINT=host.docker.internal:9101 -e AWS_ACCESS_KEY_ID=devminioadmin `
  -e "AWS_SECRET_ACCESS_KEY=devminiosecret123!" -e S3_USE_SSL=false `
  -e S3_BUCKET_NAME=nexclone-local -e S3_REGION=auto -e MINIO_PUBLIC_ENDPOINT=127.0.0.1:9101 `
  nexclone-backend-local
# frontend: cd frontend && npm run dev   (http://localhost:3000)
# stop: docker rm -f nexclone-local-api; docker compose -f docker-compose.local.yml down
```
Seeded super-admin: `hamed3alii.3@gmail.com` / see `DbSeeder.SeedAdminUserAsync`.

### Affiliate system (post-clicks-removal)
**Navigation/pages (2026-08-26):** `/api/auth/me` now returns **`isAffiliate`** (active AffiliateProfiles check). Navbar (desktop + mobile drawer) shows "Earn With Us"/"اربح معنا" → `/affiliate-program` for logged-out & not-joined users, and "My Earnings"/"أرباحي" → `/affiliate` once joined. `/affiliate` is a thin switcher (login gate; not-joined → redirect to program page; else `<AffiliateDashboard/>` extracted component). `/affiliate-program` = marketing + embedded `AffiliateOnboardingForm` (#join anchor); joined users are auto-redirected to `/affiliate`; successful join calls fetchMe (+appStore mirror) so the navbar flips instantly without reload.

**Google-OAuth join hardening (2026-08-26):** Google login shares the exact auth/referral/onboarding contract with password login (same cookies, `refCode`+`aff_session` linking in google-login) — verified live. Frontend hardening for state edges: ① onboarding submit returning `"User is already an affiliate."` is treated as success (refresh session → dashboard, no red dead-end for legacy affiliates), ② program page runs a one-shot live profile probe when the session flag says not-joined — existing profile ⇒ refresh session → dashboard (stale-flag guard). Backend unchanged.

Flow: onboard (`POST api/affiliate/onboard` → AF-id + referralCode) → visitor hits `/api/affiliate-track/click?ref_code=X` → session token (+`aff_session` cookie set by frontend proxy) → referred signup links via refCode or cookie → payment (webhook / PayPal capture / admin AssignPlan) → **FIRST_PURCHASE commission PENDING** → daily job releases after hold → payout request → admin APPROVED→…→PAID. Fraud toggles: `Affiliate.PreventIpFraud` / `PreventFingerprintFraud` block same-IP/fingerprint self-referrals at linking time.

**Recurring day-limits (2026-08-26):** two global settings replace the retired Max-Recurring-Months:
- **`Affiliate.TimeWindowDays`** (0 = unlimited) — real days since the customer's **first commission-attempted payment** (anchors `AffiliateReferrals.FirstEligiblePaymentAt`); recurring commissions stop once expired.
- **`Affiliate.MaxPackageDurationDays`** (0 = unlimited) — cumulative plan-days of packages that actually earned a commission (`AffiliateReferrals.AccumulatedPackageDays`); recurring stops at cap.
Whichever hits first permanently stops recurring earnings for that customer. Cap/overshoot applies to RECURRING only: a package that would overshoot is **skipped whole**; first purchase always earns & anchors but its duration counts toward the cap; refunds do **not** decrement. Enforced by shared `TryApplyCommissionDayLimits` in BOTH commission paths (`ProcessPaymentCommissionAsync` + legacy `CreateCommissionAsync`). Columns added via DbSeeder raw-SQL guard + baseline snapshot updated. Admin: Affiliate Settings page has both fields ("0 for unlimited").

Commission/payout enums are stored **UPPERCASE strings** in Postgres (`'FIRST_PURCHASE'`, `'PENDING'`, …) — match exactly in raw SQL.

### E2E test suite — 27 checks, all green (2026-08-26)
Script: `%TEMP%\opencode\affiliate-e2e.ps1`. Covers: settings seeding · plan seeding (`GET /seed-test-plans`) · register→verify→login→onboard · click sessions ×3 with TotalClicks staying 0 · referral linking · admin AssignPlan w/ antiforgery scrape · commission lifecycle incl. hold-release & duplicate-payment guard · stats shape (no totalClicks; conv vs signups) · payout request→approve→paid w/ balance math · IP-fraud block.

**Testing gotchas baked into the script:**
- Backend sets `SameSite=None; Secure` JWT cookies — .NET clients drop them over HTTP; take `token` from login response body and use `Authorization: Bearer`
- Verify-email tokens come from Identity (`ConfirmEmailAsync`) — extract from queued email HTML in `hangfire.job` (`invocationdata::text LIKE '%<email>%'`, then URL-decode `token=`)
- Admin MVC POSTs need `__RequestVerificationToken` scraped from a rendered page using the same WebSession
- Email sending fails locally by design (no Brevo key) — jobs retry in Hangfire, harmless

*End of reference.*
