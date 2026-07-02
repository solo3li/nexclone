using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddToolRoutingRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "ModelName",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "ProviderName",
                table: "ToolConfigurations");

            migrationBuilder.CreateTable(
                name: "ToolRoutingRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ToolConfigurationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ActiveFromTime = table.Column<TimeSpan>(type: "interval", nullable: true),
                    ActiveToTime = table.Column<TimeSpan>(type: "interval", nullable: true),
                    MaxDailyRequests = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToolRoutingRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToolRoutingRules_ToolConfigurations_ToolConfigurationId",
                        column: x => x.ToolConfigurationId,
                        principalTable: "ToolConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ToolRoutingRules_ToolConfigurationId",
                table: "ToolRoutingRules",
                column: "ToolConfigurationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ToolRoutingRules");

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
                name: "ModelName",
                table: "ToolConfigurations",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProviderName",
                table: "ToolConfigurations",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
