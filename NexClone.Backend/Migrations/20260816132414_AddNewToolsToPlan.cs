using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNewToolsToPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImageToVideoEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ReferenceToVideoEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TextToImageEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TextToVideoEnabled",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageToVideoEnabled",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ReferenceToVideoEnabled",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "TextToImageEnabled",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "TextToVideoEnabled",
                table: "Plans");
        }
    }
}
