using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCentralizedAffiliateSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {




            migrationBuilder.DropColumn(
                name: "AllowedWalletTypeIds",
                table: "ToolConfigurations");



            migrationBuilder.AlterColumn<string>(
                name: "AdditionalSettings",
                table: "ToolConfigurations",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb");


            migrationBuilder.AddColumn<decimal>(
                name: "AffiliateFirstCommissionPercent",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "AffiliateRecurringCommissionPercent",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);



            migrationBuilder.CreateTable(
                name: "AffiliateProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AffiliateDisplayId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ReferralCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    TotalClicks = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AffiliateProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AffiliateProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AffiliatePayouts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AffiliateProfileId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    PayoutMethod = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PayoutAccount = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RejectionReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AffiliatePayouts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AffiliatePayouts_AffiliateProfiles_AffiliateProfileId",
                        column: x => x.AffiliateProfileId,
                        principalTable: "AffiliateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AffiliateReferrals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AffiliateProfileId = table.Column<int>(type: "integer", nullable: false),
                    ReferredUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    SessionToken = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ClickedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AttributionExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    HasConverted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AffiliateReferrals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AffiliateReferrals_AffiliateProfiles_AffiliateProfileId",
                        column: x => x.AffiliateProfileId,
                        principalTable: "AffiliateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AffiliateReferrals_AspNetUsers_ReferredUserId",
                        column: x => x.ReferredUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "AffiliateCommissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AffiliateProfileId = table.Column<int>(type: "integer", nullable: false),
                    AffiliateReferralId = table.Column<int>(type: "integer", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanId = table.Column<int>(type: "integer", nullable: false),
                    SubscriptionId = table.Column<int>(type: "integer", nullable: false),
                    PaymentId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Rate = table.Column<decimal>(type: "numeric", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AvailableAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AffiliateCommissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AffiliateCommissions_AffiliateProfiles_AffiliateProfileId",
                        column: x => x.AffiliateProfileId,
                        principalTable: "AffiliateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AffiliateCommissions_AffiliateReferrals_AffiliateReferralId",
                        column: x => x.AffiliateReferralId,
                        principalTable: "AffiliateReferrals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AffiliateCommissions_AspNetUsers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AffiliateCommissions_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AffiliateCommissions_Plans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "Plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AffiliateCommissions_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_AffiliateProfileId",
                table: "AffiliateCommissions",
                column: "AffiliateProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_AffiliateReferralId",
                table: "AffiliateCommissions",
                column: "AffiliateReferralId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_CustomerId",
                table: "AffiliateCommissions",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_PaymentId",
                table: "AffiliateCommissions",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_PlanId",
                table: "AffiliateCommissions",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateCommissions_SubscriptionId",
                table: "AffiliateCommissions",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliatePayouts_AffiliateProfileId",
                table: "AffiliatePayouts",
                column: "AffiliateProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateProfiles_ReferralCode",
                table: "AffiliateProfiles",
                column: "ReferralCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateProfiles_UserId",
                table: "AffiliateProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateReferrals_AffiliateProfileId",
                table: "AffiliateReferrals",
                column: "AffiliateProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateReferrals_ReferredUserId",
                table: "AffiliateReferrals",
                column: "ReferredUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AffiliateCommissions");

            migrationBuilder.DropTable(
                name: "AffiliatePayouts");

            migrationBuilder.DropTable(
                name: "AffiliateReferrals");

            migrationBuilder.DropTable(
                name: "AffiliateProfiles");

            migrationBuilder.DropColumn(
                name: "AllowPremiumCredits",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "AllowStandardCredits",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "AffiliateFirstCommissionPercent",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "AffiliateRecurringCommissionPercent",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "Features",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "FeaturesAr",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "PremiumCredits",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "StandardCredits",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "IsSuperAdmin",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PremiumCredits",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "VisibleAdminSections",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "StandardCredits",
                table: "AspNetUsers",
                newName: "AvailableCredits");

            migrationBuilder.AlterColumn<string>(
                name: "AdditionalSettings",
                table: "ToolConfigurations",
                type: "jsonb",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "AllowedWalletTypeIds",
                table: "ToolConfigurations",
                type: "integer[]",
                nullable: false);

            migrationBuilder.CreateTable(
                name: "WalletTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Icon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalletTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PackageToolWallets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlanId = table.Column<int>(type: "integer", nullable: false),
                    ToolConfigurationId = table.Column<Guid>(type: "uuid", nullable: false),
                    WalletTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageToolWallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PackageToolWallets_Plans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "Plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageToolWallets_ToolConfigurations_ToolConfigurationId",
                        column: x => x.ToolConfigurationId,
                        principalTable: "ToolConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageToolWallets_WalletTypes_WalletTypeId",
                        column: x => x.WalletTypeId,
                        principalTable: "WalletTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PackageWallets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlanId = table.Column<int>(type: "integer", nullable: false),
                    WalletTypeId = table.Column<int>(type: "integer", nullable: false),
                    CreditsAmount = table.Column<decimal>(type: "numeric(18,4)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageWallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PackageWallets_Plans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "Plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageWallets_WalletTypes_WalletTypeId",
                        column: x => x.WalletTypeId,
                        principalTable: "WalletTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserWallets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SubscriptionId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    WalletTypeId = table.Column<int>(type: "integer", nullable: false),
                    Balance = table.Column<decimal>(type: "numeric(18,4)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserWallets_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserWallets_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserWallets_WalletTypes_WalletTypeId",
                        column: x => x.WalletTypeId,
                        principalTable: "WalletTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PackageToolWallets_PlanId",
                table: "PackageToolWallets",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageToolWallets_ToolConfigurationId",
                table: "PackageToolWallets",
                column: "ToolConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageToolWallets_WalletTypeId",
                table: "PackageToolWallets",
                column: "WalletTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageWallets_PlanId",
                table: "PackageWallets",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageWallets_WalletTypeId",
                table: "PackageWallets",
                column: "WalletTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserWallets_SubscriptionId",
                table: "UserWallets",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserWallets_UserId",
                table: "UserWallets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserWallets_WalletTypeId",
                table: "UserWallets",
                column: "WalletTypeId");
        }
    }
}
