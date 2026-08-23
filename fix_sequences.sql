SELECT setval(pg_get_serial_sequence('"Subscriptions"', 'Id'), COALESCE(MAX("Id") + 1, 1), false) FROM "Subscriptions";
SELECT setval(pg_get_serial_sequence('"Plans"', 'Id'), COALESCE(MAX("Id") + 1, 1), false) FROM "Plans";
SELECT setval(pg_get_serial_sequence('"UserWallets"', 'Id'), COALESCE(MAX("Id") + 1, 1), false) FROM "UserWallets";
SELECT setval(pg_get_serial_sequence('"PackageWallets"', 'Id'), COALESCE(MAX("Id") + 1, 1), false) FROM "PackageWallets";
SELECT setval(pg_get_serial_sequence('"PackageToolWallets"', 'Id'), COALESCE(MAX("Id") + 1, 1), false) FROM "PackageToolWallets";
SELECT setval(pg_get_serial_sequence('"WalletTypes"', 'Id'), COALESCE(MAX("Id") + 1, 1), false) FROM "WalletTypes";
