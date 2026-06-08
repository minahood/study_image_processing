type Props = {
  score: number
  total: number
  onRetry: () => void
}

function getMessage(rate: number): { text: string; emoji: string } {
  if (rate >= 0.8) return { emoji: '🎉', text: '素晴らしい！画像処理の基礎をしっかり理解しています。' }
  if (rate >= 0.6) return { emoji: '👍', text: 'よくできました！苦手な問題を復習してみましょう。' }
  return { emoji: '📚', text: 'もう少し！解説を読み返して再チャレンジしてみましょう。' }
}

export default function ResultScreen({ score, total, onRetry }: Props) {
  const rate = total > 0 ? score / total : 0
  const percent = Math.round(rate * 100)
  const { emoji, text } = getMessage(rate)

  return (
    <div style={{ maxWidth: 480, margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{emoji}</div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {score} / {total} 問正解
      </h2>

      <p style={{
        display: 'inline-block',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: rate >= 0.8 ? '#16a34a' : rate >= 0.6 ? '#d97706' : '#dc2626',
        marginBottom: '1rem',
      }}>
        正答率 {percent}%
      </p>

      <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '2rem' }}>{text}</p>

      <button
        onClick={onRetry}
        style={{
          padding: '0.75rem 2rem',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        もう一度挑戦
      </button>
    </div>
  )
}
