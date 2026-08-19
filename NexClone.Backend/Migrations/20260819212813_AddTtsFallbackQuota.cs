using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTtsFallbackQuota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FallbackThresholdLimit",
                table: "TextToVoiceSettings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FallbackResetDurationHours",
                table: "TextToVoiceSettings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentPrimaryRequestCount",
                table: "TextToVoiceSettings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastResetDate",
                table: "TextToVoiceSettings",
                type: "timestamp with time zone",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FallbackThresholdLimit",
                table: "TextToVoiceSettings");

            migrationBuilder.DropColumn(
                name: "FallbackResetDurationHours",
                table: "TextToVoiceSettings");

            migrationBuilder.DropColumn(
                name: "CurrentPrimaryRequestCount",
                table: "TextToVoiceSettings");

            migrationBuilder.DropColumn(
                name: "LastResetDate",
                table: "TextToVoiceSettings");
        }
    }
}
