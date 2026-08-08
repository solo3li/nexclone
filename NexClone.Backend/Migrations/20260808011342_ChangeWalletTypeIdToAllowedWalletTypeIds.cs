using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeWalletTypeIdToAllowedWalletTypeIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToolConfigurations_WalletTypes_WalletTypeId",
                table: "ToolConfigurations");

            migrationBuilder.DropIndex(
                name: "IX_ToolConfigurations_WalletTypeId",
                table: "ToolConfigurations");

            migrationBuilder.DropColumn(
                name: "WalletTypeId",
                table: "ToolConfigurations");

            migrationBuilder.AddColumn<List<int>>(
                name: "AllowedWalletTypeIds",
                table: "ToolConfigurations",
                type: "integer[]",
                nullable: false,
                defaultValueSql: "'{}'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowedWalletTypeIds",
                table: "ToolConfigurations");

            migrationBuilder.AddColumn<int>(
                name: "WalletTypeId",
                table: "ToolConfigurations",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ToolConfigurations_WalletTypeId",
                table: "ToolConfigurations",
                column: "WalletTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToolConfigurations_WalletTypes_WalletTypeId",
                table: "ToolConfigurations",
                column: "WalletTypeId",
                principalTable: "WalletTypes",
                principalColumn: "Id");
        }
    }
}
