using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddQualityLevelAndRemovePriority : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "ToolRoutingRules");

            migrationBuilder.AddColumn<int>(
                name: "MaxRequestsPerMinute",
                table: "ToolRoutingRules",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QualityLevel",
                table: "ToolRoutingRules",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TtsCostPerCharHigh",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TtsCostPerCharMedium",
                table: "Plans",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxRequestsPerMinute",
                table: "ToolRoutingRules");

            migrationBuilder.DropColumn(
                name: "QualityLevel",
                table: "ToolRoutingRules");

            migrationBuilder.DropColumn(
                name: "TtsCostPerCharHigh",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "TtsCostPerCharMedium",
                table: "Plans");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "ToolRoutingRules",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
