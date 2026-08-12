import pytest
from tests.utils.api_client import ApiClient

@pytest.fixture
def api_client():
    return ApiClient(base_url="http://localhost:8080")
