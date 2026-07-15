# AI-Powered-Debt-Relief-Financial-Recovery-Platform
This project is a web-based platform that helps borrowers understand their debt situation, estimate settlement options, and generate AI-assisted negotiation letters to lenders. It combines financial analysis with generative AI to provide personalized guidance for debt relief and financial recovery.
# Features
Loan details input form (lender, amount, EMI, income, overdue months)
Financial analysis of EMI-to-income ratio and monthly surplus
Debt stress classification (Low / Medium / High)Recommended settlement amount and discount percentage
AI-generated negotiation letter using Google GeminiHistory of past settlement analyses and lettersSimple and intuitive React-based user interface
# Tech Stack
   # Frontend
   React.js
   HTML, CSS, JavaScript
   # Backend
   FastAPI (Python)
   SQLAlchemy ORM
   SQLite database
   AI Integration
   Google Gemini API for generating negotiation letters and text recommendations

# System Architecture
  The system follows a simple client–server architecture:
    The React.js frontend collects loan details from the user and sends them to the backend via REST APIs.
    The FastAPI backend processes the data, performs financial analysis, stores information in SQLite, and calls the  Gemini API for AI-generated text.
    The SQLite database stores user, loan, settlement, and negotiation history.
    The Gemini AI service produces professional and polite negotiation letters based on borrower financial data.

# Project Modules
  # User Interface Module
    Page to add new loan details
    Page to view analysis and recommended settlement
    Page to view AI-generated negotiation letter
    History page for past requests

  # Financial Analysis Module
    Calculates monthly surplus (income − EMI)
    Computes EMI-to-income ratio
    Classifies debt stress as Low / Medium / High
    Suggests settlement amount and discount percentage

  # AI Negotiation Module
    Builds prompts using borrower and loan details
    Calls Google Gemini API to generate a formal negotiation email
    Stores AI-generated letter in negotiation history
  # Database Management Module
    Manages tables for users, loans, settlement requests, and negotiation history
    Uses SQLAlchemy ORM with SQLite

  # API Endpoints
    # Base URL: http://localhost:8000
      *POST /api/loans
      Create a new loan record.
      *GET /api/loans?user_id=
       Get all loans for a specific user.
      *POST /api/analyze
       Analyze a loan, compute debt stress, and recommend settlement.
      *POST /api/generate-letter
       Generate an AI-based negotiation letter using Gemini.
      *GET /api/history?user_id=
       Get past settlement analyses and letters.

   # How to Run
   #     Note: Adjust commands and paths based on your environment.
   # Backend (FastAPI)
    1.Create and activate a virtual environment.
    2.bash
      pip install fastapi uvicorn sqlalchemy pydantic sqlite3 google-generativeai
    3.Run the backend server: 
      bash
      uvicorn main:app --reload
  # Frontend (React)
    Navigate to the frontend folder.
    Install dependencies:
     bash
     npm install
    Run the development server:
     bash
     npm start
    Open the app in the browser http://localhost:3000/
