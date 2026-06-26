DO $$
DECLARE
    u_id uuid;
    p_id integer;
BEGIN
    SELECT "Id" INTO p_id FROM "Plans" WHERE "SttEnabled" = true LIMIT 1;

    SELECT "Id"::uuid INTO u_id FROM "AspNetUsers" WHERE "Email" = 'test_stt@test.com' LIMIT 1;
    
    UPDATE "AspNetUsers" SET "AvailableCredits" = 1000, "IsVerified" = true WHERE "Id"::uuid = u_id;
    
    INSERT INTO "Subscriptions" ("UserId", "PlanId", "StartDate", "EndDate", "Status", "CreatedAt")
    VALUES (u_id, p_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '30 days', 'Active', CURRENT_TIMESTAMP);
END $$;
