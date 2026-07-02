using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddErrorMessageToGenerationHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ErrorMessage",
                table: "GenerationHistories",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ErrorMessage",
                table: "GenerationHistories");
        }
    }
}
