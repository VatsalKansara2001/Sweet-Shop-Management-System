import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
from app.models.user import User
from app.models.sweet import Sweet
from app.core.security import get_password_hash, create_access_token

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user(test_db):
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("testpassword123"),
        full_name="Test User",
        is_admin=False,
        is_active=True
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user

@pytest.fixture
def test_admin_user(test_db):
    admin = User(
        email="admin@example.com",
        hashed_password=get_password_hash("adminpassword123"),
        full_name="Admin User",
        is_admin=True,
        is_active=True
    )
    test_db.add(admin)
    test_db.commit()
    test_db.refresh(admin)
    return admin

@pytest.fixture
def test_sweet(test_db):
    sweet = Sweet(
        name="Chocolate Cake",
        category="Cakes",
        price=12.99,
        quantity=10,
        description="Delicious chocolate cake",
        is_available=True
    )
    test_db.add(sweet)
    test_db.commit()
    test_db.refresh(sweet)
    return sweet

@pytest.fixture
def user_token(test_user):
    return create_access_token(data={"sub": test_user.email})

@pytest.fixture
def admin_token(test_admin_user):
    return create_access_token(data={"sub": test_admin_user.email})

@pytest.fixture
def auth_headers_user(user_token):
    return {"Authorization": f"Bearer {user_token}"}

@pytest.fixture
def auth_headers_admin(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
