import { useMemo, useState } from 'react'
import type { Quiz } from '../quizzes'
import QuizCard from './QuizCard'

type Props = {
  quizzes: Quiz[]
  onFinish: (score: number, total: number) => void
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizSession({ quizzes, onFinish }: Props) {
  const shuffled = useMemo(() => fisherYatesShuffle(quizzes), [quizzes])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)

  const total = shuffled.length
  const current = shuffled[index]
  const progress = ((index) / total) * 100

  function handleAnswer(isCorrect: boolean) {
    const newScore = isCorrect ? score + 1 : score
    if (index + 1 >= total) {
      onFinish(newScore, total)
    } else {
      setScore(newScore)
      setIndex(index + 1)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>カテゴリ：{current.category}</span>
        <span style={{ fontWeight: 'bold', color: '#374151' }}>{index + 1} / {total}</span>
      </div>

      {/* プログレスバー */}
      <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#2563eb',
          borderRadius: '999px',
          transition: 'width 0.3s',
        }} />
      </div>

      <QuizCard key={current.id} quiz={current} onAnswer={handleAnswer} />
    </div>
  )
}
