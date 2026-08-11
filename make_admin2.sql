UPDATE "AspNetUsers" SET "EmailConfirmed" = true, "IsStaff" = true, "IsSuperAdmin" = true WHERE "Email" = 'admin2@nexmedia.com';
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT u."Id", r."Id" 
FROM "AspNetUsers" u, "AspNetRoles" r 
WHERE u."Email" = 'admin2@nexmedia.com' AND r."Name" = 'Admin'
ON CONFLICT DO NOTHING;
