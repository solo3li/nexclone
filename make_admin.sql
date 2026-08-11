UPDATE "AspNetUsers" SET "IsStaff" = true, "IsSuperAdmin" = true WHERE "Email" = 'superadmin@nexmedia.com';
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT u."Id", r."Id" 
FROM "AspNetUsers" u, "AspNetRoles" r 
WHERE u."Email" = 'superadmin@nexmedia.com' AND r."Name" = 'Admin'
ON CONFLICT DO NOTHING;
