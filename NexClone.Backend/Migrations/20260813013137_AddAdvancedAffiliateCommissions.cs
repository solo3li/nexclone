using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedAffiliateCommissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AffiliateRecurringCommissionPercent",
                table: "Plans",
                newName: "AffiliateRecurringCommissionValueUsd");

            migrationBuilder.RenameColumn(
                name: "AffiliateFirstCommissionPercent",
                table: "Plans",
                newName: "AffiliateRecurringCommissionValueEgp");

            migrationBuilder.AddColumn<string>(
                name: "AffiliateFirstCommissionType",
                table: "Plans",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "AffiliateFirstCommissionValueEgp",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "AffiliateFirstCommissionValueUsd",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "AffiliateRecurringCommissionType",
                table: "Plans",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AffiliateFirstCommissionType",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "AffiliateFirstCommissionValueEgp",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "AffiliateFirstCommissionValueUsd",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "AffiliateRecurringCommissionType",
                table: "Plans");

            migrationBuilder.RenameColumn(
                name: "AffiliateRecurringCommissionValueUsd",
                table: "Plans",
                newName: "AffiliateRecurringCommissionPercent");

            migrationBuilder.RenameColumn(
                name: "AffiliateRecurringCommissionValueEgp",
                table: "Plans",
                newName: "AffiliateFirstCommissionPercent");
        }
    }
}
