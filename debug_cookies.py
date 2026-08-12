import subprocess
from tests.utils.api_client import ApiClient

def execute_sql(query):
    res = subprocess.run([
        "docker", "exec", "nexclone-postgres", "psql",
        "-U", "nexclone", "-d", "nexclone_dev",
        "-t", "-c", query
    ], capture_output=True, text=True)
    return res.stdout.strip()

client = ApiClient()
client.register("test_aff_cookie@test.com", "Password123!")
client.login("test_aff_cookie@test.com", "Password123!")
print("Cookies:", client.session.cookies.get_dict())
