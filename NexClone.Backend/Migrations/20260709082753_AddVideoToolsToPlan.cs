using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoToolsToPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AvatarVideoCostPerGeneration",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "AvatarVideoEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "LipSyncCostPerGeneration",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "LipSyncEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarVideoCostPerGeneration",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "AvatarVideoEnabled",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "LipSyncCostPerGeneration",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "LipSyncEnabled",
                table: "Plans");
        }
    }
}
