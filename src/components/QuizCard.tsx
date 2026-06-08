import { useState } from 'react'
import type { Quiz } from '../quizzes'
import SourceImageCanvas from './SourceImageCanvas'
import ProcessedImageCanvas from './ProcessedImageCanvas'

type Props = {
  quiz: Quiz
  onAnswer: (isCorrect: boolean) => void
}

export default function QuizCard({ quiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const answered = selected !== null

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
  }

  function handleNext() {
    if (selected === null) return
    onAnswer(selected === quiz.answer)
    setSelected(null)
  }

  function choiceStyle(index: number): React.CSSProperties {
    const base: React.CSSProperties = {
      display: 'block',
      width: '100%',
      padding: '0.75rem 1rem',
      marginBottom: '0.5rem',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      background: '#fff',
      textAlign: 'left',
      fontSize: '0.95rem',
      cursor: answered ? 'default' : 'pointer',
    }
    if (!answered) return base
    if (index === quiz.answer) {
      return { ...base, background: '#dcfce7', borderColor: '#16a34a', color: '#15803d', fontWeight: 'bold' }
    }
    if (index === selected) {
      return { ...base, background: '#fee2e2', borderColor: '#dc2626', color: '#b91c1c' }
    }
    return { ...base, opacity: 0.5 }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* 問題文 */}
      <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem', whiteSpace: 'pre-wrap' }}>
        {quiz.question}
      </p>

      {/* 画像プレビュー */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>元画像</figcaption>
          <SourceImageCanvas quizId={quiz.id} width={200} height={200} />
        </figure>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>処理後</figcaption>
          <div style={{ filter: answered ? 'none' : 'blur(12px)', transition: 'filter 0.4s', borderRadius: '4px', overflow: 'hidden', display: 'inline-block' }}>
            <ProcessedImageCanvas quizId={quiz.id} width={200} height={200} />
          </div>
        </figure>
      </div>

      {/* 選択肢 */}
      <div style={{ marginBottom: '1rem' }}>
        {quiz.choices.map((choice, i) => (
          <button key={i} style={choiceStyle(i)} onClick={() => handleSelect(i)}>
            <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{String.fromCharCode(65 + i)}.</span>
            {choice}
          </button>
        ))}
      </div>

      {/* 解説 */}
      {answered && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: '#0c4a6e',
        }}>
          <strong>解説：</strong>{quiz.explanation}
        </div>
      )}

      {/* 次へボタン */}
      {answered && (
        <button
          onClick={handleNext}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          次の問題へ →
        </button>
      )}
    </div>
  )
}
