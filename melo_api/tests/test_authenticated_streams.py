

import asyncio
from uuid import uuid4

import httpx

BASE_URL = "http://localhost:8000"


async def main():
    test_email = f"test_{uuid4().hex[:8]}@melo.dev"
    test_password = "TestPassword123!"

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Sign up + sign in to get a real token
        await client.post(f"{BASE_URL}/sign_up", json={
            "email": test_email,
            "password": test_password,
            "display_name": "Test User",
        })

        signin_res = await client.post(f"{BASE_URL}/sign_in", json={
            "email": test_email,
            "password": test_password,
        })
        access_token = signin_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}

        # 2. You'll need a real conversation_id here — 
        #    adjust this once you have a "create conversation" endpoint.
        #    For now, paste in a conversation_id you created manually via a script/DB.
        conversation_id = "cbb952a4-4a33-43e7-9561-a0b513d0e05547"

        # 3. Stream a message using the authenticated token
        async with client.stream(
            "POST",
            f"{BASE_URL}/chat/{conversation_id}/stream",
            headers=headers,
            json={"content": "Hey Melo, tell me a fun fact."},
        ) as response:
            print(f"Status: {response.status_code}")
            async for line in response.aiter_lines():
                if line:
                    print(line)


if __name__ == "__main__":
    asyncio.run(main())