import { useEffect, useRef } from 'react'
import { generateSourceImage } from '../processors/testImages'
import { loadImage, isRealImage, realImagePath } from '../processors/imageLoader'
import { patternSourceImage } from '../processors/fft'
import { allQuizzes } from '../quizzes'

type Props = {
  /** クイズID。指定するとそのクイズの sourceImage を描画する */
  quizId?: string
  /** sourceImage を直接指定する場合（quizId より優先） */
  sourceImage?: string
  width?: number
  height?: number
  showAxes?: boolean
  drawAxesFn?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
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
  drawAxesFn,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const type = resolveSourceImage(quizId, sourceImage)

    const applyAxes = () => { if (drawAxesFn) drawAxesFn(ctx, width, height) }

    if (type.startsWith('pat_')) {
      const img = patternSourceImage(type.slice(4), width)
      const off = document.createElement('canvas')
      off.width = img.width; off.height = img.height
      off.getContext('2d')!.putImageData(img, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(off, 0, 0, width, height)
      applyAxes()
    } else if (isRealImage(type)) {
      // Show loading state
      ctx.fillStyle = '#e5e7eb'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#6b7280'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Loading...', width / 2, height / 2)

      loadImage(realImagePath(type), width, height).then((img) => {
        if (canvasRef.current !== canvas) return // unmounted
        ctx.putImageData(img, 0, 0)
        applyAxes()
      })
    } else {
      const img = generateSourceImage(type)
      const off = document.createElement('canvas')
      off.width = img.width
      off.height = img.height
      off.getContext('2d')!.putImageData(img, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(off, 0, 0, width, height)
      applyAxes()
    }
  }, [quizId, sourceImage, width, height, drawAxesFn])

  return <canvas ref={canvasRef} width={width} height={height} />
}
