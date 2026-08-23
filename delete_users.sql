DO $$ 
DECLARE 
    r RECORD;
    deleted_count INT;
    total_deleted INT := 0;
    iteration INT := 0;
BEGIN
    LOOP
        deleted_count := 0;
        FOR r IN (
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'AspNetUsers'
        ) LOOP
            BEGIN
                EXECUTE 'DELETE FROM "' || r.table_name || '" WHERE "' || r.column_name || '" IN (SELECT "Id" FROM "AspNetUsers" WHERE "Email" NOT IN (''hamed3alii.3@gmail.com'', ''fps60y@gmail.com''));';
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
                total_deleted := total_deleted + deleted_count;
            EXCEPTION WHEN OTHERS THEN
                -- Ignore constraint errors for now, will catch in next iteration
            END;
        END LOOP;

        iteration := iteration + 1;
        EXIT WHEN iteration > 10; -- safeguard
    END LOOP;

    DELETE FROM "AspNetUsers" WHERE "Email" NOT IN ('hamed3alii.3@gmail.com', 'fps60y@gmail.com');
END $$;
