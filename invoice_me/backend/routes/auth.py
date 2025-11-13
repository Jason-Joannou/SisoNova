from fastapi import APIRouter, status
from models.auth import UserLoginParameters
from models.users import UserProfile


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login", response_model=UserProfile, description="Authenticate a user and return their profile", status_code=status.HTTP_200_OK)
async def login(user: UserLoginParameters) -> UserProfile:
    pass


