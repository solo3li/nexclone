using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedanceModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReferenceToVideoModelPricings",
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
                    table.PrimaryKey("PK_ReferenceToVideoModelPricings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReferenceToVideoSettings",
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
                    table.PrimaryKey("PK_ReferenceToVideoSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReferenceToVideoModelPricings");

            migrationBuilder.DropTable(
                name: "ReferenceToVideoSettings");
        }
    }
}
