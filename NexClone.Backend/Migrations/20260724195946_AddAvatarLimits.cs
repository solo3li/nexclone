using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarLimits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AffiliateReferrals");

            migrationBuilder.DropTable(
                name: "AffiliateTransactions");

            migrationBuilder.DropColumn(
                name: "AffiliateCashBalance",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsCashAffiliate",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReferredById",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "AvatarVideoMaxCharsPerRequest",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AvatarVideoMaxFileSizeMb",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarVideoMaxCharsPerRequest",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "AvatarVideoMaxFileSizeMb",
                table: "Plans");

            migrationBuilder.AddColumn<decimal>(
                name: "AffiliateCashBalance",
                table: "AspNetUsers",
                type: "numeric(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsCashAffiliate",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ReferredById",
                table: "AspNetUsers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AffiliateReferrals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ReferredUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReferrerId = table.Column<Guid>(type: "uuid", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AffiliateReferrals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AffiliateReferrals_AspNetUsers_ReferredUserId",
                        column: x => x.ReferredUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AffiliateReferrals_AspNetUsers_ReferrerId",
                        column: x => x.ReferrerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AffiliateTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AffiliateId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,4)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AffiliateTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AffiliateTransactions_AspNetUsers_AffiliateId",
                        column: x => x.AffiliateId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateReferrals_ReferredUserId",
                table: "AffiliateReferrals",
                column: "ReferredUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateReferrals_ReferrerId",
                table: "AffiliateReferrals",
                column: "ReferrerId");

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateTransactions_AffiliateId",
                table: "AffiliateTransactions",
                column: "AffiliateId");
        }
    }
}
