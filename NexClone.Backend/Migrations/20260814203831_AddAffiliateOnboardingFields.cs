using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAffiliateOnboardingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookAccount",
                table: "AffiliateProfiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MobileNumber",
                table: "AffiliateProfiles",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PolicyAcceptedAt",
                table: "AffiliateProfiles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TelegramUsername",
                table: "AffiliateProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatsappNumber",
                table: "AffiliateProfiles",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookAccount",
                table: "AffiliateProfiles");

            migrationBuilder.DropColumn(
                name: "MobileNumber",
                table: "AffiliateProfiles");

            migrationBuilder.DropColumn(
                name: "PolicyAcceptedAt",
                table: "AffiliateProfiles");

            migrationBuilder.DropColumn(
                name: "TelegramUsername",
                table: "AffiliateProfiles");

            migrationBuilder.DropColumn(
                name: "WhatsappNumber",
                table: "AffiliateProfiles");
        }
    }
}
