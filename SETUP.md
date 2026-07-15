# Setup & Run Guide

## 1. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Open .env and paste your Gemini API key (https://aistudio.google.com/app/apikey)
# The app works without it too — it falls back to a demo letter template.

uvicorn main:app --reload --port 8000
```

Backend runs at **http://localhost:8000**
Interactive API docs: **http://localhost:8000/docs**

The SQLite database file (`debt_relief.db`) and all tables are created automatically
the first time you start the server.

## 2. Frontend (React + Vite)

Open a second terminal:

```bash
cd frontend
npm install

cp .env.example .env
# Default VITE_API_URL=http://localhost:8000 is correct if you didn't change the backend port

npm run dev
```

Frontend runs at **http://localhost:5173**

## 3. Using the app

1. Open http://localhost:5173 → you'll land on Login → click "Create an account"
2. Register with your name, email, password, and monthly income
3. Go to **Loans** → add one or more loans (lender, loan amount, EMI, overdue months, interest rate)
4. Go to **Settlement Predictor** → pick a loan → "Run analysis" to see EMI-to-income ratio,
   debt stress level, and a recommended settlement amount
5. Go to **AI Letter Generator** → pick the analysis you just ran → choose a tone → "Generate letter"

## Troubleshooting

- **CORS errors in the browser console**: make sure the backend is running on port 8000
  and `VITE_API_URL` in `frontend/.env` matches it.
- **Gemini errors / demo letter always shown**: check `backend/.env` has a real
  `GEMINI_API_KEY`, then restart `uvicorn`.
- **`ModuleNotFoundError` on backend start**: make sure your virtual environment is
  activated before `pip install -r requirements.txt`.
- **Blank page on frontend**: check the browser console — usually a missing `npm install`
  or the backend not running yet.

## Project structure

```
debt-relief-platform/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # SQLAlchemy engine/session
│   ├── models.py               # ORM models (User, Loan, SettlementRequest, NegotiationHistory)
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── auth.py             # register / login / me
│   │   ├── loans.py            # loan CRUD
│   │   ├── analysis.py         # settlement analysis + history
│   │   └── letters.py          # AI negotiation letter generation + history
│   └── services/
│       ├── auth_utils.py       # password hashing, JWT
│       ├── financial.py        # EMI ratio, stress level, settlement math
│       └── gemini_service.py   # Gemini API integration
└── frontend/
    ├── src/
    │   ├── main.jsx / App.jsx
    │   ├── AuthContext.jsx     # global auth state
    │   ├── api/                # axios client + endpoint functions
    │   ├── components/         # Layout, ProtectedRoute, StressBadge
    │   └── pages/               # Login, Register, Dashboard, Loans, Predictor, Letters
    ├── package.json
    └── .env.example
```
