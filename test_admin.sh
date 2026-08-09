#!/bin/bash
COOKIE_FILE="cookies.txt"
rm -f $COOKIE_FILE
echo "Logging in..."
curl -s -c $COOKIE_FILE -X POST http://localhost:8080/AdminAuth/Login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=superadmin@nexmedia.com&password=Admin123!&returnUrl=/"

PAGES=(
"ApiConfigAdmin"
"BlogAdmin"
"CustomPagesAdmin"
"HistoryAdmin"
"LogsAdmin"
"MailingAdmin"
"ManualPaymentMethodsAdmin"
"ManualPaymentsAdmin"
"PaymentConfigAdmin"
"PlansAdmin"
"SettingsAdmin"
"SocialLinksAdmin"
"SystemUpdatesAdmin"
"TicketsAdmin"
"ToolConfigAdmin"
"WalletTypesAdmin"
)

echo "Testing pages..."
for page in "${PAGES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b $COOKIE_FILE "http://localhost:8080/${page}")
    echo "[${STATUS}] /${page}"
    if [ "$STATUS" == "500" ]; then
       echo "ERROR ON ${page}"
    fi
done
