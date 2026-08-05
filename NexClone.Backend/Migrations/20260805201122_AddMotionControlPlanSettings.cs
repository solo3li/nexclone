using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMotionControlPlanSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "MotionControlCostPerGeneration",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "MotionControlEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MotionControlMaxImageFileSizeMb",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MotionControlMaxVideoFileSizeMb",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "MotionControlProCost",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MotionControlCostPerGeneration",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "MotionControlEnabled",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "MotionControlMaxImageFileSizeMb",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "MotionControlMaxVideoFileSizeMb",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "MotionControlProCost",
                table: "Plans");
        }
    }
}
