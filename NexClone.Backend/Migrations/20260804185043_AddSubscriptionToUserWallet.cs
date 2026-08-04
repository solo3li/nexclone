using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSubscriptionToUserWallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubscriptionId",
                table: "UserWallets",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserWallets_SubscriptionId",
                table: "UserWallets",
                column: "SubscriptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserWallets_Subscriptions_SubscriptionId",
                table: "UserWallets",
                column: "SubscriptionId",
                principalTable: "Subscriptions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserWallets_Subscriptions_SubscriptionId",
                table: "UserWallets");

            migrationBuilder.DropIndex(
                name: "IX_UserWallets_SubscriptionId",
                table: "UserWallets");

            migrationBuilder.DropColumn(
                name: "SubscriptionId",
                table: "UserWallets");
        }
    }
}
