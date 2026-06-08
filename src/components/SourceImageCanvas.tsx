import { useEffect, useRef } from 'react'
import { generateSourceImage } from '../processors/testImages'
import { allQuizzes } from '../quizzes'

type Props = {
  /** クイズID。指定するとそのクイズの sourceImage を描画する */
  quizId?: string
  /** sourceImage を直接指定する場合（quizId より優先） */
  sourceImage?: string
  width?: number
  height?: number
}

function resolveSourceImage(quizId?: string, sourceImage?: string): string {
  if (sourceImage) return sourceImage
  const quiz = allQuizzes.find((q) => q.id === quizId)
  return quiz?.sourceImage ?? 'geometric'
}

/**
 * 処理前の元画像をそのまま表示するコンポーネント。
 */
export default function SourceImageCanvas({
  quizId,
  sourceImage,
  width = 200,
  height = 200,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const type = resolveSourceImage(quizId, sourceImage)
    const img = generateSourceImage(type)

    // 生成画像（200×200）を canvas サイズに合わせて描画
    const off = document.createElement('canvas')
    off.width = img.width
    off.height = img.height
    off.getContext('2d')!.putImageData(img, 0, 0)

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(off, 0, 0, width, height)
  }, [quizId, sourceImage, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}
