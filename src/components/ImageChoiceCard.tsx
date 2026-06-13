import { useEffect, useRef } from 'react'
import { processChoiceAsync } from '../processors/processChoice'
import type { QuizChoice } from '../quizzes'

type State = 'idle' | 'selected' | 'correct' | 'wrong'

type Props = {
  choice: QuizChoice
  sourceImage: string
  state: State
  onClick: () => void
  disabled: boolean
  drawAxesFn?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}

export default function ImageChoiceCard({ choice, sourceImage, state, onClick, disabled, drawAxesFn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (choice.kernelMatrix) return  // skip canvas for text choices
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Show loading
    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(0, 0, 150, 150)
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Loading...', 75, 75)

    let cancelled = false
    processChoiceAsync(sourceImage, choice).then((processed) => {
      if (cancelled) return
      const off = document.createElement('canvas')
      off.width = processed.width
      off.height = processed.height
      off.getContext('2d')!.putImageData(processed, 0, 0)
      ctx.clearRect(0, 0, 150, 150)
      ctx.drawImage(off, 0, 0, 150, 150)
      if (drawAxesFn) drawAxesFn(ctx, 150, 150)
    })
    return () => { cancelled = true }
  }, [choice, sourceImage, drawAxesFn])

  const borderColor = state === 'correct' ? '#16a34a'
    : state === 'wrong' ? '#dc2626'
    : state === 'selected' ? '#2563eb'
    : '#d1d5db'
  const borderWidth = state !== 'idle' ? 3 : 2

  if (choice.kernelMatrix) {
    const bg = state === 'correct' ? '#dcfce7'
      : state === 'wrong' ? '#fee2e2'
      : state === 'selected' ? '#eff6ff'
      : '#fff'

    // Parse "value [×scale]" lines into rows of cells + optional scale annotation
    // Format: each line is "v1  v2  v3" optionally with "×1/9" suffix on one line
    const lines = choice.kernelMatrix.trim().split('\n')
    let scale = ''
    const rows = lines.map((line) => {
      const scaleMatch = line.match(/×\S+/)
      if (scaleMatch) scale = scaleMatch[0]
      const cells = line.replace(/×\S+/, '').trim().split(/\s+/)
      return cells
    })

    const cellStyle: React.CSSProperties = {
      border: '1px solid #374151',
      padding: '4px 6px',
      textAlign: 'center',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      minWidth: '28px',
      color: '#1f2937',
    }

    return (
      <div
        onClick={disabled ? undefined : onClick}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'default' : 'pointer',
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: '8px',
          overflow: 'hidden',
          width: 150,
          height: 150,
          background: bg,
          padding: '8px',
          boxSizing: 'border-box',
          gap: '4px',
        }}
      >
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map((cells, ri) => (
              <tr key={ri}>
                {cells.map((cell, ci) => (
                  <td key={ci} style={cellStyle}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {scale && (
          <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#374151' }}>
            {scale}
          </div>
        )}
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
