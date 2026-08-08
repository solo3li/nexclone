import re

users = {} # id -> (email, balance)
pro_users = set()

in_users = False
in_subs = False

with open("prod_backup_thomas.sql", "r") as f:
    for line in f:
        if line.startswith('COPY public."AspNetUsers"'):
            in_users = True
            continue
        if line.startswith('COPY public."Subscriptions"'):
            in_subs = True
            continue
            
        if line.startswith('\\.'):
            in_users = False
            in_subs = False
            
        if in_users:
            parts = line.strip('\n').split('\t')
            if len(parts) >= 23:
                user_id = parts[0]
                email = parts[9]
                try:
                    balance = float(parts[22])
                    users[user_id] = (email, balance)
                except ValueError:
                    pass
                    
        if in_subs:
            parts = line.strip('\n').split('\t')
            if len(parts) >= 7:
                user_id = parts[5]
                plan_id = parts[6]
                if plan_id == '21':
                    pro_users.add(user_id)

with open("pro_users_balance.txt", "w") as f:
    for uid in pro_users:
        if uid in users:
            email, balance = users[uid]
            f.write(f"{email} : {balance}\n")

print("Done")
