export default function StressBadge({ level }) {
  if (!level) return null
  return (
    <span className={`stress-badge ${level}`}>
      <span className="stress-dot" />
      {level} stress
    </span>
  )
}
