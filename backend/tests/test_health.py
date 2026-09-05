import pytest


@pytest.mark.asyncio
async def test_root_identifies_the_api(api_client):
    response = await api_client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "DevManiac API"}


@pytest.mark.asyncio
async def test_health_is_available_without_a_database(api_client):
    response = await api_client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
