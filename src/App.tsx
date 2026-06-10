import { useState } from 'react'
import { allQuizzes, toneCurveQuizzes, kernelQuizzes, thresholdQuizzes, geometricQuizzes, realImageQuizzes, kernelReverseQuizzes } from './quizzes'
import type { Quiz } from './quizzes'
import QuizSession from './components/QuizSession'
import ResultScreen from './components/ResultScreen'
import KernelPlayground from './components/KernelPlayground'

type Screen = 'start' | 'quiz' | 'result' | 'playground'

type Category = {
  id: string
  label: string
  quizzes: Quiz[]
}

const CATEGORIES: Category[] = [
  { id: 'all',           label: 'すべて（全39問）',                quizzes: allQuizzes },
  { id: 'toneCurve',     label: 'トーンカーブ（5問）',              quizzes: toneCurveQuizzes },
  { id: 'kernel',        label: 'カーネルフィルタ（7問）',          quizzes: kernelQuizzes },
  { id: 'threshold',     label: '二値化・形態学（3問）',            quizzes: thresholdQuizzes },
  { id: 'geometric',     label: '幾何学変換（5問）',                quizzes: geometricQuizzes },
  { id: 'realImage',     label: 'フリー画像クイズ（12問）',         quizzes: realImageQuizzes },
  { id: 'kernelReverse', label: 'カーネル逆問題（7問）',            quizzes: kernelReverseQuizzes },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  const activeQuizzes = CATEGORIES.find((c) => c.id === selectedCategory)?.quizzes ?? allQuizzes

  function handleStart() {
    setResult(null)
    setScreen('quiz')
  }

  function handleFinish(score: number, total: number) {
    setResult({ score, total })
    setScreen('result')
  }

  function handleRetry() {
    setScreen('start')
  }

  if (screen === 'playground') {
    return <KernelPlayground onBack={() => setScreen('start')} />
  }

  if (screen === 'quiz') {
    return (
      <>
        <header style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
          <button
            onClick={() => setScreen('start')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#1d4ed8' }}
          >
            画像処理クイズ
          </button>
        </header>
        <QuizSession key={selectedCategory} quizzes={activeQuizzes} onFinish={handleFinish} />
      </>
    )
  }

  if (screen === 'result' && result) {
    return <ResultScreen score={result.score} total={result.total} onRetry={handleRetry} />
  }

  // start 画面
  return (
    <div style={{ maxWidth: 600, margin: '4rem auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        画像処理クイズ
      </h1>
      <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
        4択クイズで画像処理の基礎を学ぼう。各問題では処理前・処理後の画像を見比べながら答えられます。
      </p>

      <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#374151' }}>
        カテゴリを選ぶ
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '0.75rem 1rem',
              border: `2px solid ${selectedCategory === cat.id ? '#2563eb' : '#d1d5db'}`,
              borderRadius: '8px',
              background: selectedCategory === cat.id ? '#eff6ff' : '#fff',
              color: selectedCategory === cat.id ? '#1d4ed8' : '#374151',
              fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '0.875rem',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.05rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        開始する →
      </button>
      <button
        onClick={() => setScreen('playground')}
        style={{
          marginTop: '0.75rem',
          width: '100%',
          padding: '0.875rem',
          background: '#fff',
          color: '#2563eb',
          border: '2px solid #2563eb',
          borderRadius: '8px',
          fontSize: '1.05rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🔬 カーネルプレイグラウンド
      </button>
    </div>
  )
}
