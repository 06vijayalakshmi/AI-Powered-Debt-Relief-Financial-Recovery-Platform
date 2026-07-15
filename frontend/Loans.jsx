import { useEffect, useState } from 'react'
import { listLoans, createLoan, deleteLoan } from '../api/endpoints'
import { formatCurrency } from '../utils/format'

const emptyForm = { lender_name: '', loan_amount: '', emi_amount: '', overdue_months: '', interest_rate: '' }

export default function Loans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadLoans() {
    setLoading(true)
    listLoans().then(setLoans).finally(() => setLoading(false))
  }

  useEffect(loadLoans, [])

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createLoan({
        lender_name: form.lender_name,
        loan_amount: parseFloat(form.loan_amount),
        emi_amount: parseFloat(form.emi_amount),
        overdue_months: parseInt(form.overdue_months) || 0,
        interest_rate: parseFloat(form.interest_rate) || 0,
      })
      setForm(emptyForm)
      setShowForm(false)
      loadLoans()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not add loan.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this loan record?')) return
    await deleteLoan(id)
    loadLoans()
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Your loans</h1>
          <p>Add each loan so we can analyze your overall debt picture.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add loan'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 28 }}>
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Lender name</label>
                <input required value={form.lender_name} onChange={(e) => updateField('lender_name', e.target.value)} placeholder="e.g. Horizon Bank" />
              </div>
              <div className="form-group">
                <label>Loan amount</label>
                <input required type="number" min="0" step="0.01" value={form.loan_amount} onChange={(e) => updateField('loan_amount', e.target.value)} placeholder="15000" />
              </div>
              <div className="form-group">
                <label>Monthly EMI</label>
                <input required type="number" min="0" step="0.01" value={form.emi_amount} onChange={(e) => updateField('emi_amount', e.target.value)} placeholder="450" />
              </div>
              <div className="form-group">
                <label>Months overdue</label>
                <input type="number" min="0" value={form.overdue_months} onChange={(e) => updateField('overdue_months', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Interest rate (%)</label>
                <input type="number" min="0" step="0.01" value={form.interest_rate} onChange={(e) => updateField('interest_rate', e.target.value)} placeholder="14.5" />
              </div>
            </div>
            <button className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save loan'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>Loading loans…</p>
        ) : loans.length === 0 ? (
          <div className="empty-state">
            <h3>No loans added yet</h3>
            <p>Add a loan above to start tracking your debt.</p>
          </div>
        ) : (
          <>
            <div className="loan-row loan-row-header">
              <div>Lender</div>
              <div>Loan amount</div>
              <div>Monthly EMI</div>
              <div>Overdue</div>
              <div>Interest</div>
              <div></div>
            </div>
            {loans.map((loan) => (
              <div className="loan-row" key={loan.id}>
                <div>{loan.lender_name}</div>
                <div className="figure">{formatCurrency(loan.loan_amount)}</div>
                <div className="figure">{formatCurrency(loan.emi_amount)}</div>
                <div>{loan.overdue_months} mo</div>
                <div>{loan.interest_rate}%</div>
                <div>
                  <button className="link-btn danger" onClick={() => handleDelete(loan.id)}>Remove</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
