# Setup Instructions

## Quick Start with Docker (Recommended)

1. Clone the repository
2. Run `docker-compose up --build`
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Manual Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend Tests
```bash
cd backend
pytest --cov=app --cov-report=html
```

### Frontend Tests
```bash
cd frontend
npm test
```