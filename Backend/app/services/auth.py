from app.core.security import create_access_token, get_password_hash, verify_password
from app.repositories.users import UserRepository
from app.schemas.auth import TokenResponse
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, users: UserRepository):
        self.users = users

    def register(self, payload: UserCreate):
        existing = self.users.get_by_email(payload.email)
        if existing:
            raise ValueError("Email already registered")

        return self.users.create(
            email=payload.email,
            full_name=payload.full_name,
            hashed_password=get_password_hash(payload.password),
        )

    def login(self, *, email: str, password: str) -> TokenResponse:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise ValueError("Invalid email or password")

        token = create_access_token(subject=str(user.id))
        return TokenResponse(access_token=token)
