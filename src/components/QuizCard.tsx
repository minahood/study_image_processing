import { useState } from 'react'
import type { Quiz } from '../quizzes'
import SourceImageCanvas from './SourceImageCanvas'
import ImageChoiceCard from './ImageChoiceCard'

type Props = {
  quiz: Quiz
  onAnswer: (isCorrect: boolean) => void
}

export default function QuizCard({ quiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  function getState(i: number) {
    if (!answered) return 'idle'
    if (i === quiz.answer) return 'correct'
    if (i === selected) return 'wrong'
    return 'idle'
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem', whiteSpace: 'pre-wrap' }}>
        {quiz.question}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>元画像</figcaption>
          <SourceImageCanvas sourceImage={quiz.sourceImage} width={200} height={200} />
        </figure>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', justifyItems: 'center', marginBottom: '1.5rem' }}>
        {quiz.choices.map((choice, i) => (
          <ImageChoiceCard
            key={i}
            choice={choice}
            sourceImage={quiz.sourceImage}
            state={getState(i) as 'idle' | 'selected' | 'correct' | 'wrong'}
            onClick={() => setSelected(i)}
            disabled={answered}
          />
        ))}
      </div>
      {answered && (
        <>
          <div style={{
            padding: '1rem', marginBottom: '1rem',
            background: '#f0f9ff', border: '1px solid #bae6fd',
            borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.7, color: '#0c4a6e',
          }}>
            <strong>解説：</strong>{quiz.explanation}
          </div>
          <button
            onClick={() => { onAnswer(selected === quiz.answer); setSelected(null) }}
            style={{
              display: 'block', width: '100%', padding: '0.75rem',
              background: '#2563eb', color: '#fff', border: 'none',
              borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
            }}
          >
            次の問題へ →
          </button>
        </>
      )}
    </div>
  )
}
