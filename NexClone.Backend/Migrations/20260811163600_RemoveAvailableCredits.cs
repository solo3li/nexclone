using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAvailableCredits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableCredits",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AvailableCredits",
                table: "AspNetUsers",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
