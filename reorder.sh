#!/bin/bash
awk '
/^INSERT INTO/ {
    if (match($0, /"public"\."([^"]+)"/, arr)) {
        table = arr[1]
        file = "/root/nexmedia/split_" table ".sql"
    }
}
{
    if (file != "") print >> file
}
' /root/nexmedia/newdb_fixed.sql

cat /root/nexmedia/split_Plans.sql \
    /root/nexmedia/split_AspNetUsers.sql \
    /root/nexmedia/split_Subscriptions.sql \
    /root/nexmedia/split_UserWallets.sql \
    /root/nexmedia/split_PackageWallets.sql \
    /root/nexmedia/split_PackageToolWallets.sql > /root/nexmedia/newdb_ordered.sql
