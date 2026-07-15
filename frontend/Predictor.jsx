import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listLoans, runAnalysis } from '../api/endpoints'
import { formatCurrency, formatPercent } from '../utils/format'
import StressBadge from '../components/StressBadge'

export default function Predictor() {
  const [loans, setLoans] = useState([])
  const [selectedLoanId, setSelectedLoanId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listLoans().then((data) => {
      setLoans(data)
      if (data.length > 0) setSelectedLoanId(String(data[0].id))
    }).finally(() => setLoading(false))
  }, [])

  async function handleAnalyze() {
    if (!selectedLoanId) return
    setError('')
    setAnalyzing(true)
    setResult(null)
    try {
      const data = await runAnalysis(parseInt(selectedLoanId))
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed.')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return <p>Loading…</p>

  if (loans.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1>Settlement predictor</h1>
          <p>Estimate a fair settlement offer based on your financial situation.</p>
        </div>
        <div className="card empty-state">
          <h3>Add a loan first</h3>
          <p>You'll need at least one loan on file before we can run an analysis.</p>
          <Link to="/loans" className="btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
            Go to loans
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Settlement predictor</h1>
        <p>Estimate a fair settlement offer based on your financial situation.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Choose a loan</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select
            value={selectedLoanId}
            onChange={(e) => setSelectedLoanId(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid var(--color-border)' }}
          >
            {loans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.lender_name} — {formatCurrency(loan.loan_amount)}
              </option>
            ))}
          </select>
          <button className="btn-primary" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? 'Analyzing…' : 'Run analysis'}
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="card-title">Results</div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">EMI-to-income ratio</div>
              <div className="stat-value figure">{formatPercent(result.emi_to_income_ratio)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Monthly surplus</div>
              <div className="stat-value figure">{formatCurrency(result.monthly_surplus)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Debt stress level</div>
              <div style={{ marginTop: 4 }}><StressBadge level={result.debt_stress_level} /></div>
            </div>
          </div>

          <div style={{ background: 'var(--color-clay-soft)', borderRadius: 12, padding: 20, marginTop: 8 }}>
            <div className="stat-label">Recommended settlement offer</div>
            <div className="stat-value figure" style={{ fontSize: 32, color: 'var(--color-clay)' }}>
              {formatCurrency(result.recommended_settlement_amount)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 4 }}>
              A {formatPercent(result.discount_percentage)} reduction off the original loan amount
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginTop: 16 }}>
            This is an estimate to guide your negotiation, not a guaranteed offer or financial advice.
          </p>

          <Link to="/letters" className="link-btn" style={{ display: 'inline-block', marginTop: 8 }}>
            Generate a negotiation letter for this →
          </Link>
        </div>
      )}
    </div>
  )
}
