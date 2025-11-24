from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel
from models.auth import TokenResponse
from config import Secrets
from models.auth import TokenInfo, EntityAccessId, TokenAccessType
from database.mongo_client import MongoDBClient
from database.mongo_operations import get_user_information

password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
mongo_client = MongoDBClient()

class AuthenticationService:

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return password_hash.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        return password_hash.hash(password)
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> bool:
        user = await get_user_information(mongo_client, email)
        if not user:
            return False
        if not AuthenticationService.verify_password(password, user.password_hash):
            return False
        return True

class AuthorizationService:
    
    @staticmethod
    def create_access_token(subject_info: str, entity: EntityAccessId) -> str:
        # Get Secrets
        secrets = Secrets()
        jwt_secret = secrets.jwt_secret_key
        jwt_algorithm = secrets.jwt_algorithm
        expire_minutes = secrets.access_token_expire_minutes
        
        # Prepare token info
        sub = f"{entity.value}:{subject_info}" 
        exp = int((datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)).timestamp())
        access_type = TokenAccessType.ACCESS.value
        
        token_info = TokenInfo(sub=sub, exp=exp, type=access_type)
        to_encode = token_info.model_dump()
        
        encoded_jwt = jwt.encode(to_encode, jwt_secret, algorithm=jwt_algorithm)
        return encoded_jwt

    @staticmethod
    def create_refresh_token(subject_info: str, entity: EntityAccessId) -> str:
        # Get Secrets
        secrets = Secrets()
        jwt_secret = secrets.jwt_secret_key
        jwt_algorithm = secrets.jwt_algorithm
        expire_minutes = secrets.refresh_token_expire_minutes
        
        # Prepare token info
        sub = f"{entity.value}:{subject_info}" 
        exp = int((datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)).timestamp())
        access_type = TokenAccessType.REFRESH.value
        
        token_info = TokenInfo(sub=sub, exp=exp, type=access_type)
        to_encode = token_info.model_dump()
        
        encoded_jwt = jwt.encode(to_encode, jwt_secret, algorithm=jwt_algorithm)
        return encoded_jwt
