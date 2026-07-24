using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSystemUpdatesTranslation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "SystemUpdates",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "SystemUpdates",
                newName: "DescriptionEn");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "SystemUpdates",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TitleAr",
                table: "SystemUpdates",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "SystemUpdates");

            migrationBuilder.DropColumn(
                name: "TitleAr",
                table: "SystemUpdates");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "SystemUpdates",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "DescriptionEn",
                table: "SystemUpdates",
                newName: "Description");
        }
    }
}
