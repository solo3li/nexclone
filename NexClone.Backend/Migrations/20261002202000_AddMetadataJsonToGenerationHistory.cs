using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using NexClone.Backend.Infrastructure.Data;

#nullable disable

namespace NexClone.Backend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20261002202000_AddMetadataJsonToGenerationHistory")]
    public partial class AddMetadataJsonToGenerationHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetadataJson",
                table: "GenerationHistories",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MetadataJson",
                table: "GenerationHistories");
        }
    }
}
