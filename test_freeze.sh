#!/bin/bash
USER_ID="019f45b1-0b78-7487-ba25-c00ee8776f77"
# 1. Ensure user has a Plan (e.g. PlanId=1) and a Subscription
echo "Setting up active subscription..."
docker compose exec postgres psql -U postgres -d nexclonedb -c "
DELETE FROM \"Subscriptions\" WHERE \"UserId\" = '$USER_ID';
INSERT INTO \"Subscriptions\" (\"Id\", \"UserId\", \"PlanId\", \"Status\", \"StartDate\", \"EndDate\")
VALUES (1001, '$USER_ID', 1, 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days');
"
