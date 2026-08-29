using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class BlogBilingualAndSEO : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "BlogPosts",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "BlogPosts",
                newName: "TitleAr");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentAr",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentEn",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "ContentAr",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "ContentEn",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "BlogPosts");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "BlogPosts",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "TitleAr",
                table: "BlogPosts",
                newName: "Content");
        }
    }
}
