import asyncio
import httpx
from uuid import uuid4

BASE_URL = "http://localhost:8000"  # adjust if your app runs on a different port


async def main():
    test_email = f"test_{uuid4().hex[:8]}@melo.dev"
    test_password = "TestPassword123!"

    async with httpx.AsyncClient() as client:

        # 1. SIGN UP
        print("--- 1. Sign Up ---")
        signup_res = await client.post(
            f"{BASE_URL}/sign_up",
            json={
                "email": test_email,
                "password": test_password,
                "display_name": "Test User",
            },
        )
        print(f"Status: {signup_res.status_code}")
        print(signup_res.json())

        if signup_res.status_code != 201:
            print("❌ Sign up failed, stopping.")
            return

        # 2. SIGN IN
        print("\n--- 2. Sign In ---")
        signin_res = await client.post(
            f"{BASE_URL}/sign_in",
            json={
                "email": test_email,
                "password": test_password,
            },
        )
        print(f"Status: {signin_res.status_code}")
        signin_data = signin_res.json()
        print(signin_data)

        if signin_res.status_code != 200:
            print("❌ Sign in failed, stopping.")
            return

        access_token = signin_data["access_token"]

        # 3. HIT A PROTECTED ENDPOINT WITH A VALID TOKEN
        print("\n--- 3. Protected route WITH valid token ---")
        # Adjust this to whatever protected route actually exists right now
        # (swap for your real conversations/chat endpoint once wired up)
        headers = {"Authorization": f"Bearer {access_token}"}
        protected_res = await client.get(f"{BASE_URL}/me", headers=headers)  # example route, adjust
        print(f"Status: {protected_res.status_code}")
        print(protected_res.text)

        # 4. HIT THE SAME ENDPOINT WITH NO TOKEN — should cleanly 401
        print("\n--- 4. Protected route WITH NO token ---")
        no_token_res = await client.get(f"{BASE_URL}/me")
        print(f"Status: {no_token_res.status_code}")
        print(no_token_res.text)

        # 5. HIT THE SAME ENDPOINT WITH A GARBAGE TOKEN — should cleanly 401
        print("\n--- 5. Protected route WITH garbage token ---")
        bad_headers = {"Authorization": "Bearer this.is.not.a.real.token"}
        bad_token_res = await client.get(f"{BASE_URL}/me", headers=bad_headers)
        print(f"Status: {bad_token_res.status_code}")
        print(bad_token_res.text)


if __name__ == "__main__":
    asyncio.run(main())