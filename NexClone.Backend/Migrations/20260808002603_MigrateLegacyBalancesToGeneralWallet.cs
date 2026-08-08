using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class MigrateLegacyBalancesToGeneralWallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DO $$ 
DECLARE
    gen_wallet_type_id INT;
BEGIN
    -- Get the WalletTypeId for GENERAL
    SELECT ""Id"" INTO gen_wallet_type_id FROM ""WalletTypes"" WHERE ""Code"" = 'GENERAL' LIMIT 1;
    
    IF gen_wallet_type_id IS NULL THEN
        RETURN;
    END IF;

    -- Update existing general wallets by adding AvailableCredits, if they exist
    UPDATE ""UserWallets"" w
    SET ""Balance"" = w.""Balance"" + u.""AvailableCredits"",
        ""UpdatedAt"" = NOW()
    FROM ""AspNetUsers"" u
    WHERE w.""UserId"" = u.""Id""
      AND w.""WalletTypeId"" = gen_wallet_type_id
      AND u.""AvailableCredits"" > 0;

    -- Insert new general wallets for users who have AvailableCredits but no general wallet
    INSERT INTO ""UserWallets"" (""UserId"", ""WalletTypeId"", ""Balance"", ""UpdatedAt"", ""SubscriptionId"")
    SELECT 
        u.""Id"", 
        gen_wallet_type_id, 
        u.""AvailableCredits"", 
        NOW(),
        (SELECT s.""Id"" FROM ""Subscriptions"" s WHERE s.""UserId"" = u.""Id"" AND s.""Status"" = 'active' LIMIT 1)
    FROM ""AspNetUsers"" u
    WHERE u.""AvailableCredits"" > 0
      AND NOT EXISTS (
          SELECT 1 FROM ""UserWallets"" w2 
          WHERE w2.""UserId"" = u.""Id"" 
            AND w2.""WalletTypeId"" = gen_wallet_type_id
      );

    -- Zero out the AvailableCredits so it isn't migrated again
    UPDATE ""AspNetUsers""
    SET ""AvailableCredits"" = 0
    WHERE ""AvailableCredits"" > 0;
END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
