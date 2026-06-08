import { useEffect, useRef } from 'react'

type Props = {
  width?: number
  height?: number
}

/**
 * テスト用画像を Canvas コンテキストに描画する。
 * グラデーション背景＋幾何図形（矩形・円・三角形）の組み合わせ。
 * SourceImageCanvas と ProcessedImageCanvas で共通利用する。
 */
export function drawTestImage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  // 黒→白の対角グラデーション背景
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#000000')
  grad.addColorStop(1, '#ffffff')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // 赤い矩形
  ctx.fillStyle = 'rgb(220, 50, 50)'
  ctx.fillRect(w * 0.12, h * 0.12, w * 0.32, h * 0.32)

  // 青い円
  ctx.fillStyle = 'rgb(50, 80, 220)'
  ctx.beginPath()
  ctx.arc(w * 0.68, h * 0.58, Math.min(w, h) * 0.18, 0, Math.PI * 2)
  ctx.fill()

  // 緑の三角形
  ctx.fillStyle = 'rgb(60, 200, 90)'
  ctx.beginPath()
  ctx.moveTo(w * 0.5, h * 0.55)
  ctx.lineTo(w * 0.88, h * 0.95)
  ctx.lineTo(w * 0.28, h * 0.95)
  ctx.closePath()
  ctx.fill()
}

/**
 * テスト用画像の ImageData をオフスクリーンで生成する。
 */
export function generateTestImageData(w: number, h: number): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  drawTestImage(ctx, w, h)
  return ctx.getImageData(0, 0, w, h)
}

/**
 * 処理前の元画像をそのまま表示するコンポーネント。
 */
export default function SourceImageCanvas({ width = 200, height = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawTestImage(ctx, width, height)
  }, [width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}
