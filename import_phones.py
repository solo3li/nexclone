import csv
import sys
import uuid

def process_csv(csv_path, sql_path):
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        with open(sql_path, 'w', encoding='utf-8-sig') as sql_file:
            
            
            for row in reader:
                user_id = row['User ID']
                phone_number = row['Phone Number']
                created_at = row['Created At']
                phone_record_id = row['Phone Record ID']
                
                if not phone_record_id:
                    phone_record_id = str(uuid.uuid4())
                
                # Update AspNetUsers table
                sql_file.write(f"""UPDATE "AspNetUsers" SET "PhoneNumber" = '{phone_number}', "PhoneNumberConfirmed" = true WHERE "Id" = '{user_id}';\n""")
                
                # Upsert into PhoneNumbers table
                sql_file.write(f"""INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('{phone_record_id}', '{phone_number}', true, '{created_at}', '{created_at}', '{user_id}') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";\n\n""")
                
            

if __name__ == '__main__':
    process_csv('phone_numbers_export (6).csv', 'import_phones.sql')
    print("SQL script generated successfully!")
