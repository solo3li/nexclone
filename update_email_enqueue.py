import os
import re

def replace_email_enqueue(content):
    pattern = r'BackgroundJob\.Enqueue<IEmailService>\(\w+ => \w+\.SendEmailAsync\((.+?),\s*(.+?),\s*(.+?),\s*(.+?)\)\);'
    
    def replacer(match):
        to_email = match.group(1).strip()
        to_name = match.group(2).strip()
        subject = match.group(3).strip()
        html_body = match.group(4).strip()
        return f'BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage {{ ToEmail = {to_email}, ToName = {to_name}, Subject = {subject}, HtmlBody = {html_body} }}));'

    pattern2 = r'Hangfire\.BackgroundJob\.Enqueue<IEmailService>\(\w+ => \w+\.SendEmailAsync\((.+?),\s*(.+?),\s*(.+?),\s*(.+?)\)\);'
    
    def replacer2(match):
        to_email = match.group(1).strip()
        to_name = match.group(2).strip()
        subject = match.group(3).strip()
        html_body = match.group(4).strip()
        return f'Hangfire.BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage {{ ToEmail = {to_email}, ToName = {to_name}, Subject = {subject}, HtmlBody = {html_body} }}));'

    content = re.sub(pattern, replacer, content)
    content = re.sub(pattern2, replacer2, content)
    return content

files = [
    "/root/nexmedia/nexclone/NexClone.Backend/API/Controllers/Client/AuthController.cs",
    "/root/nexmedia/nexclone/NexClone.Backend/API/Controllers/Webhooks/WebhooksController.cs",
    "/root/nexmedia/nexclone/NexClone.Backend/API/Controllers/Admin/ManualPaymentsAdminController.cs",
    "/root/nexmedia/nexclone/NexClone.Backend/Infrastructure/Consumers/BaseAiTaskConsumer.cs"
]

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        original = file.read()
    updated = replace_email_enqueue(original)
    if original != updated:
        with open(f, "w", encoding="utf-8") as file:
            file.write(updated)
        print(f"Updated {f}")

