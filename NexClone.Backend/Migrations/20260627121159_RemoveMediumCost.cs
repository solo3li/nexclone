using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMediumCost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TtsCostPerCharMedium",
                table: "Plans");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TtsCostPerCharMedium",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
