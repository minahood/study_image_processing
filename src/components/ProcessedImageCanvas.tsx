import { useEffect, useRef } from 'react'
import {
  applyToneCurve,
  applyKernel,
  applyThreshold,
  morphology,
} from '../processors'
import type { Channel, CurvePoint } from '../processors'
import { allQuizzes } from '../quizzes'
import { generateTestImageData } from './SourceImageCanvas'

type Props = {
  quizId: string
  width?: number
  height?: number
}

// 各 processor が期待する params の型
type ToneCurveParams = { channel: Channel; curvePoints: CurvePoint[] }
type KernelParams = { kernel: readonly (readonly number[])[] }
type ThresholdParams = { method: 'otsu' | 'fixed'; value?: number }
type MorphologyParams = { operation: 'dilate' | 'erode'; kernelSize: number }

/**
 * quizId に対応する画像処理をテスト画像に適用して ImageData を返す。
 * クイズ定義から processorFn と params を引き、処理関数で分岐する。
 */
function processForQuiz(quizId: string, source: ImageData): ImageData {
  const quiz = allQuizzes.find((q) => q.id === quizId)
  if (!quiz) return source

  switch (quiz.processorFn) {
    case 'applyToneCurve': {
      const p = quiz.params as ToneCurveParams
      return applyToneCurve(source, p.channel, p.curvePoints)
    }
    case 'applyKernel': {
      const p = quiz.params as KernelParams
      return applyKernel(source, p.kernel)
    }
    case 'applyThreshold': {
      const p = quiz.params as ThresholdParams
      return applyThreshold(source, p.method, p.value)
    }
    case 'morphology': {
      const p = quiz.params as MorphologyParams
      // 形態学処理は二値画像が前提なので、まず大津法で二値化してから適用する
      const binary = applyThreshold(source, 'otsu')
      return morphology(binary, p.operation, p.kernelSize)
    }
    default:
      return source
  }
}

/**
 * テスト画像に quizId の処理を適用して表示するコンポーネント。
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

    const source = generateTestImageData(width, height)
    const processed = processForQuiz(quizId, source)
    ctx.putImageData(processed, 0, 0)
  }, [quizId, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}
