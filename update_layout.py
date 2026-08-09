import re

file_path = "NexClone.Backend/Views/Shared/_Layout.cshtml"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

sections = [
    "/Users", "/Subscriptions", "PlansAdmin", "WalletTypesAdmin", "ToolConfigAdmin",
    "SettingsAdmin", "/CustomPagesAdmin", "/SocialLinksAdmin", "/BlogAdmin",
    "/TicketsAdmin", "HistoryAdmin", "SystemUpdatesAdmin", "LogsAdmin",
    "/Voices", "/PaymentConfigAdmin", "/ApiConfigAdmin", "/MailingAdmin",
    "/ManualPaymentsAdmin", "/ManualPaymentMethodsAdmin"
]

def map_key(link):
    if link.startswith("/"):
        return link
    # The others use Url.Action, e.g. @Url.Action("Index", "PlansAdmin")
    return "/" + link

for sec in sections:
    if sec.startswith("/"):
        pattern = r'(<li class="sidebar-menu-item">\s*<a href="' + sec + r'">.*?</li>)'
    else:
        pattern = r'(<li class="sidebar-menu-item">\s*<a href="@Url\.Action\("Index", "' + sec + r'"\)">.*?</li>)'
    
    key = map_key(sec)
    
    replacement = f'@if (isSuperAdmin || visibleSections.Contains("{key}")) {{\n                    \\1\n                }}'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated _Layout.cshtml")
