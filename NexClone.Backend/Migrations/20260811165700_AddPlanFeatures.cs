using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPlanFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Features",
                table: "Plans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FeaturesAr",
                table: "Plans",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Features",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "FeaturesAr",
                table: "Plans");
        }
    }
}
