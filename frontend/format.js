export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return `${value}%`
}
