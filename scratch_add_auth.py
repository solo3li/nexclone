import os
import re

controllers_dir = "./NexClone.Backend/Controllers"

admin_controllers = [
    "HomeController.cs",
    "UsersController.cs",
    "SubscriptionsController.cs",
    "PlansAdminController.cs",
    "ToolConfigAdminController.cs",
    "SettingsAdminController.cs",
    "HistoryAdminController.cs",
    "LogsAdminController.cs",
    "PaymentConfigAdminController.cs",
    "ApiConfigAdminController.cs",
    "MailingAdminController.cs",
    "ManualPaymentsAdminController.cs",
    "ManualPaymentMethodsAdminController.cs",
    "VoicesController.cs"
]

for filename in admin_controllers:
    filepath = os.path.join(controllers_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename}, not found.")
        continue

    with open(filepath, "r") as f:
        content = f.read()

    # Check if already authorized
    if "CookieAuthenticationDefaults.AuthenticationScheme" in content:
        print(f"{filename} already protected.")
        continue

    # Add usings
    usings = "using Microsoft.AspNetCore.Authorization;\nusing Microsoft.AspNetCore.Authentication.Cookies;\n"
    if "using Microsoft.AspNetCore.Authorization;" not in content:
        # insert after the first using or at top
        content = usings + content

    # Add Authorize attribute
    auth_attr = '[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]\n'
    
    # regex to find class declaration
    content = re.sub(r'(public class \w+ : Controller)', auth_attr + r'    \1', content)

    with open(filepath, "w") as f:
        f.write(content)
        
    print(f"Protected {filename}")
