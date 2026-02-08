from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from datetime import datetime, timezone

from database.mongo_dependencies import get_mongo_client
from database.mongo_operations import (
    get_user_by_supabase_id,
    create_user,
)
from database.mongo_client import MongoDBClient
from models.users import User, UserSubscriptionTier
from config import Secrets

security = HTTPBearer(auto_error=True)
secrets = Secrets()

_jwks_cache = None


async def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            resp = await client.get(secrets.supabase_jwks_url)
            resp.raise_for_status()        # ← must succeed
            _jwks_cache = resp.json()
    return _jwks_cache


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
):
    # -------- JWT verification --------
    try:
        jwks = await get_jwks()
        payload = jwt.decode(
            credentials.credentials,
            jwks,
            algorithms=["ES256", "RS256"],
            audience=secrets.supabase_audience,
            issuer=secrets.supabase_issuer,
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Supabase token",
        )

    supabase_id = payload.get("sub")
    email = payload.get("email")
    provider = payload.get("app_metadata", {}).get("provider", "unknown")

    print(f"supabase_id: {supabase_id}, email: {email}, provider: {provider}")

    if not supabase_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing sub claim in Supabase token",
        )

    # -------- Domain user resolution --------
    try:
        user = await get_user_by_supabase_id(
            supabase_id=supabase_id,
            mongo_client=mongo_client,
        )

        print(f"user: {user}")

        if not user:
            print("user not found, creating new user")
            user = await create_user(
                mongo_client=mongo_client,
                new_user_data=User(
                    supabase_id=supabase_id,
                    email=email,
                    auth_provider=provider,
                    subscription_tier=UserSubscriptionTier.FREE.value,
                    created_at=datetime.now(timezone.utc).isoformat(),
                    updated_at=datetime.now(timezone.utc).isoformat(),
                ),
            )
            print(f"user created: {user}")

        return user

    except HTTPException:
        # propagate intentional HTTP errors
        raise

    except Exception:
        # DB unavailable / unexpected failure
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load or create user",
        )
