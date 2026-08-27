using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddReferenceToVideoPricingWithVideoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CostPerSecond_480p_WithVideo",
                table: "ReferenceToVideoModelPricings",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostPerSecond_720p_WithVideo",
                table: "ReferenceToVideoModelPricings",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostPerSecond_480p_WithVideo",
                table: "ReferenceToVideoModelPricings");

            migrationBuilder.DropColumn(
                name: "CostPerSecond_720p_WithVideo",
                table: "ReferenceToVideoModelPricings");
        }
    }
}
