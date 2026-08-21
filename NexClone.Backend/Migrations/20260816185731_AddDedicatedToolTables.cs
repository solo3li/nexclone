using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDedicatedToolTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TextToVoiceSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaxTextLength = table.Column<int>(type: "integer", nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextToVoiceSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AvatarToVideoModelPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BillingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UnitCost = table.Column<decimal>(type: "numeric", nullable: false),
                    BaseCost = table.Column<decimal>(type: "numeric", nullable: false),
                    AllowedWallet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvatarToVideoModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AvatarToVideoSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    MaxImageFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxAudioFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxPromptLength = table.Column<int>(type: "integer", nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvatarToVideoSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImageToVideoModelPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BillingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BaseCost = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_480p = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_720p = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_1080p = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_4k = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_480p = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_720p = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_1080p = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_4k = table.Column<decimal>(type: "numeric", nullable: false),
                    AllowedWallet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageToVideoModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImageToVideoSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    MaxImageFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxDurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    MaxPromptLength = table.Column<int>(type: "integer", nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageToVideoSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LipSyncModelPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BillingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CostPerSecond = table.Column<decimal>(type: "numeric", nullable: false),
                    BaseCost = table.Column<decimal>(type: "numeric", nullable: false),
                    AllowedWallet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LipSyncModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LipSyncSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    MaxVideoFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxAudioFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxAudioDurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LipSyncSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MotionControlModelPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BillingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CostPerSecond = table.Column<decimal>(type: "numeric", nullable: false),
                    BaseCost = table.Column<decimal>(type: "numeric", nullable: false),
                    AllowedWallet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MotionControlModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MotionControlSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    MaxVideoFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxImageFileSizeMb = table.Column<long>(type: "bigint", nullable: false),
                    MaxDurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MotionControlSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TextToImageModelPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BillingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CostPerImage = table.Column<decimal>(type: "numeric", nullable: false),
                    BaseCost = table.Column<decimal>(type: "numeric", nullable: false),
                    AllowedWallet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextToImageModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TextToImageSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    MaxPromptLength = table.Column<int>(type: "integer", nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextToImageSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TextToVideoModelPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BillingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BaseCost = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_480p = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_720p = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_1080p = table.Column<decimal>(type: "numeric", nullable: false),
                    CostPerSecond_4k = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_480p = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_720p = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_1080p = table.Column<decimal>(type: "numeric", nullable: false),
                    FixedCost_4k = table.Column<decimal>(type: "numeric", nullable: false),
                    AllowedWallet = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextToVideoModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TextToVideoSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    MaxPromptLength = table.Column<int>(type: "integer", nullable: false),
                    MaxDurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    DefaultResolution = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    MaxConcurrentOperations = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextToVideoSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "TextToVoiceSettings");

            migrationBuilder.DropTable(
                name: "AvatarToVideoModelPricings");

            migrationBuilder.DropTable(
                name: "AvatarToVideoSettings");

            migrationBuilder.DropTable(
                name: "ImageToVideoModelPricings");

            migrationBuilder.DropTable(
                name: "ImageToVideoSettings");

            migrationBuilder.DropTable(
                name: "LipSyncModelPricings");

            migrationBuilder.DropTable(
                name: "LipSyncSettings");

            migrationBuilder.DropTable(
                name: "MotionControlModelPricings");

            migrationBuilder.DropTable(
                name: "MotionControlSettings");

            migrationBuilder.DropTable(
                name: "TextToImageModelPricings");

            migrationBuilder.DropTable(
                name: "TextToImageSettings");

            migrationBuilder.DropTable(
                name: "TextToVideoModelPricings");

            migrationBuilder.DropTable(
                name: "TextToVideoSettings");
        }
    }
}
