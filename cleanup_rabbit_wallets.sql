-- Drop legacy wallet tables
DROP TABLE IF EXISTS "UserWallets" CASCADE;
DROP TABLE IF EXISTS "PackageWallets" CASCADE;
DROP TABLE IF EXISTS "PackageToolWallets" CASCADE;
DROP TABLE IF EXISTS "WalletTypes" CASCADE;

-- Remove RabbitMQ setting
DELETE FROM "AppSettings" WHERE "Key" = 'Site.RabbitMqEnabled';
