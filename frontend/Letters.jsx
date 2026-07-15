import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAnalysisHistory, generateLetter } from '../api/endpoints'
import { formatCurrency } from '../utils/format'

const TONES = ['formal', 'firm', 'friendly']

export default function Letters() {
  const [settlements, setSettlements] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [tone, setTone] = useState('formal')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalysisHistory().then((data) => {
      setSettlements(data)
      if (data.length > 0) setSelectedId(String(data[0].id))
    }).finally(() => setLoading(false))
  }, [])

  async function handleGenerate() {
    if (!selectedId) return
    setError('')
    setGenerating(true)
    setLetter('')
    try {
      const data = await generateLetter(parseInt(selectedId), tone)
      setLetter(data.letter_content)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not generate letter.')
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(letter)
  }

  if (loading) return <p>Loading…</p>

  if (settlements.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1>AI letter generator</h1>
          <p>Turn a settlement analysis into a ready-to-send negotiation letter.</p>
        </div>
        <div className="card empty-state">
          <h3>Run a settlement analysis first</h3>
          <p>The letter generator needs an analysis to base the negotiation on.</p>
          <Link to="/predictor" className="btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
            Go to settlement predictor
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>AI letter generator</h1>
        <p>Turn a settlement analysis into a ready-to-send negotiation letter.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Choose an analysis</div>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--color-border)', marginBottom: 20 }}
        >
          {settlements.map((s) => (
            <option key={s.id} value={s.id}>
              Settlement #{s.id} — {formatCurrency(s.recommended_settlement_amount)} ({s.debt_stress_level} stress)
            </option>
          ))}
        </select>

        <div className="card-title">Tone</div>
        <div className="tone-selector">
          {TONES.map((t) => (
            <button
              key={t}
              className={'tone-option' + (tone === t ? ' selected' : '')}
              onClick={() => setTone(t)}
              type="button"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <button className="btn-clay" onClick={handleGenerate} disabled={generating}>
          {generating ? 'Writing letter…' : 'Generate letter'}
        </button>
      </div>

      {letter && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Your negotiation letter</div>
            <button className="link-btn" onClick={handleCopy}>Copy to clipboard</button>
          </div>
          <div className="letter-output">{letter}</div>
        </div>
      )}
    </div>
  )
}
