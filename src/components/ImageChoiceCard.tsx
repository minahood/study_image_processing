import { useEffect, useRef } from 'react'
import { processChoice } from '../processors/processChoice'
import type { QuizChoice } from '../quizzes'

type State = 'idle' | 'selected' | 'correct' | 'wrong'

type Props = {
  choice: QuizChoice
  sourceImage: string
  state: State
  onClick: () => void
  disabled: boolean
}

export default function ImageChoiceCard({ choice, sourceImage, state, onClick, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const processed = processChoice(sourceImage, choice)
    const off = document.createElement('canvas')
    off.width = processed.width
    off.height = processed.height
    off.getContext('2d')!.putImageData(processed, 0, 0)
    ctx.clearRect(0, 0, 150, 150)
    ctx.drawImage(off, 0, 0, 150, 150)
  }, [choice, sourceImage])

  const borderColor = state === 'correct' ? '#16a34a'
    : state === 'wrong' ? '#dc2626'
    : state === 'selected' ? '#2563eb'
    : '#d1d5db'
  const borderWidth = state !== 'idle' ? 3 : 2

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: disabled ? 'default' : 'pointer',
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: '8px',
        overflow: 'hidden',
        width: 150,
        height: 150,
      }}
    >
      <canvas ref={canvasRef} width={150} height={150} style={{ display: 'block' }} />
      <div style={{
        position: 'absolute',
        top: 4,
        left: 4,
        background: 'rgba(0,0,0,0.55)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        padding: '1px 6px',
        borderRadius: '4px',
      }}>
        {choice.label}
      </div>
    </div>
  )
}
