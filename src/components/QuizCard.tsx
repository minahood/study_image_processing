import { useState, useEffect, useRef } from 'react'
import type { Quiz, QuizChoice } from '../quizzes'
import SourceImageCanvas from './SourceImageCanvas'
import ImageChoiceCard from './ImageChoiceCard'
import { processChoiceAsync } from '../processors/processChoice'

function OutputDisplayCanvas({
  sourceImage,
  outputDisplay,
  width,
  height,
}: {
  sourceImage: string
  outputDisplay: { processorFn: string; params: object }
  width: number
  height: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(0, 0, width, height)

    let cancelled = false
    const fakeChoice: QuizChoice = {
      label: '',
      processorFn: outputDisplay.processorFn,
      params: outputDisplay.params,
    }
    processChoiceAsync(sourceImage, fakeChoice).then((processed) => {
      if (cancelled) return
      const off = document.createElement('canvas')
      off.width = processed.width
      off.height = processed.height
      off.getContext('2d')!.putImageData(processed, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(off, 0, 0, width, height)
    })
    return () => { cancelled = true }
  }, [sourceImage, outputDisplay, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}

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
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>元画像</figcaption>
          <SourceImageCanvas sourceImage={quiz.sourceImage} width={200} height={200} />
        </figure>
        {quiz.outputDisplay && (
          <figure style={{ margin: 0, textAlign: 'center' }}>
            <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>処理後</figcaption>
            <div style={{ borderRadius: '4px', overflow: 'hidden', display: 'inline-block' }}>
              <OutputDisplayCanvas sourceImage={quiz.sourceImage} outputDisplay={quiz.outputDisplay} width={200} height={200} />
            </div>
          </figure>
        )}
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
