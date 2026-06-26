using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddToolFallbackAndScheduling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "ActiveFromTime",
                table: "ToolConfigurations",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "ActiveToTime",
                table: "ToolConfigurations",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FallbackModelName",
                table: "ToolConfigurations",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FallbackProviderName",
                table: "ToolConfigurations",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxDailyRequests",
                table: "ToolConfigurations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AllowedVoices",
                table: "Plans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDefaultRegistrationPlan",
                table: "Plans",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActiveFromTime",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "ActiveToTime",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "FallbackModelName",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "FallbackProviderName",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "MaxDailyRequests",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "AllowedVoices",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "IsDefaultRegistrationPlan",
                table: "Plans");
        }
    }
}
