using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTaxesAndFixedFees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TaxPercentage",
                table: "Plans",
                newName: "TaxPercentageUsd");

            migrationBuilder.AddColumn<decimal>(
                name: "FixedFeeEgp",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "FixedFeeUsd",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxPercentageEgp",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "FixedFeeAmount",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FixedFeeEgp",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "FixedFeeUsd",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "TaxPercentageEgp",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "FixedFeeAmount",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "TaxPercentageUsd",
                table: "Plans",
                newName: "TaxPercentage");
        }
    }
}
