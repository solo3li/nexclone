using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class SoftDeleteHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeletedByUser",
                table: "GenerationHistories",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeletedByUser",
                table: "GenerationHistories");
        }
    }
}
