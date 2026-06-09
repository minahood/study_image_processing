import { useEffect, useRef } from 'react'
import { processChoice } from '../processors/processChoice'
import { allQuizzes } from '../quizzes'

type Props = {
  quizId: string
  width?: number
  height?: number
}

/**
 * テスト画像にクイズの正解choiceの処理を適用して表示するコンポーネント。
 */
export default function ProcessedImageCanvas({
  quizId,
  width = 200,
  height = 200,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const quiz = allQuizzes.find((q) => q.id === quizId)
    if (!quiz) return

    const choice = quiz.choices[quiz.answer]
    const processed = processChoice(quiz.sourceImage, choice)

    const off = document.createElement('canvas')
    off.width = processed.width
    off.height = processed.height
    off.getContext('2d')!.putImageData(processed, 0, 0)

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(off, 0, 0, width, height)
  }, [quizId, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}
