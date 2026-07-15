import client from './client'

// ---------- Auth ----------

export async function registerUser({ full_name, email, password, monthly_income }) {
  const res = await client.post('/api/auth/register', {
    full_name, email, password, monthly_income,
  })
  return res.data
}

export async function loginUser({ email, password }) {
  // FastAPI's OAuth2PasswordRequestForm expects form-encoded data
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)

  const res = await client.post('/api/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}

export async function fetchCurrentUser() {
  const res = await client.get('/api/auth/me')
  return res.data
}

// ---------- Loans ----------

export async function createLoan(loan) {
  const res = await client.post('/api/loans/', loan)
  return res.data
}

export async function listLoans() {
  const res = await client.get('/api/loans/')
  return res.data
}

export async function deleteLoan(loanId) {
  await client.delete(`/api/loans/${loanId}`)
}

// ---------- Analysis / Settlement ----------

export async function runAnalysis(loanId) {
  const res = await client.post('/api/analysis/run', { loan_id: loanId })
  return res.data
}

export async function fetchAnalysisHistory() {
  const res = await client.get('/api/analysis/history')
  return res.data
}

// ---------- Negotiation Letters ----------

export async function generateLetter(settlementId, tone) {
  const res = await client.post('/api/letters/generate', {
    settlement_id: settlementId,
    tone,
  })
  return res.data
}

export async function fetchLetterHistory() {
  const res = await client.get('/api/letters/history')
  return res.data
}
