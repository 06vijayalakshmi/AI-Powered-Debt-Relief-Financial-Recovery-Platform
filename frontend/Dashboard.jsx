import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { listLoans, fetchAnalysisHistory } from '../api/endpoints'
import { formatCurrency, formatPercent } from '../utils/format'
import StressBadge from '../components/StressBadge'

export default function Dashboard() {
  const { user } = useAuth()
  const [loans, setLoans] = useState([])
  const [settlements, setSettlements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listLoans(), fetchAnalysisHistory()])
      .then(([loanData, settlementData]) => {
        setLoans(loanData)
        setSettlements(settlementData)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalDebt = loans.reduce((sum, l) => sum + l.loan_amount, 0)
  const totalEmi = loans.reduce((sum, l) => sum + l.emi_amount, 0)
  const latestSettlement = settlements[0]

  if (loading) return <p>Loading your dashboard…</p>

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.full_name?.split(' ')[0]}</h1>
        <p>Here's where your financial recovery stands today.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Monthly income</div>
          <div className="stat-value figure">{formatCurrency(user?.monthly_income)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total outstanding debt</div>
          <div className="stat-value figure">{formatCurrency(totalDebt)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Combined monthly EMI</div>
          <div className="stat-value figure">{formatCurrency(totalEmi)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active loans</div>
          <div className="stat-value figure">{loans.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Latest financial analysis</div>
        {latestSettlement ? (
          <div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 16 }}>
              <div>
                <div className="stat-label">EMI-to-income ratio</div>
                <div className="stat-value small figure">{formatPercent(latestSettlement.emi_to_income_ratio)}</div>
              </div>
              <div>
                <div className="stat-label">Monthly surplus</div>
                <div className="stat-value small figure">{formatCurrency(latestSettlement.monthly_surplus)}</div>
              </div>
              <div>
                <div className="stat-label">Debt stress</div>
                <div style={{ marginTop: 6 }}>
                  <StressBadge level={latestSettlement.debt_stress_level} />
                </div>
              </div>
            </div>
            <Link to="/predictor" className="link-btn">Run a new analysis →</Link>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No analysis yet</h3>
            <p>Add a loan and run the settlement predictor to see your financial health.</p>
            <Link to="/loans" className="btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
              Add your first loan
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
