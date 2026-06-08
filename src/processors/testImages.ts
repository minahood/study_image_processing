/**
 * クイズ用のテスト画像生成。すべて 200×200 の ImageData を返す。
 * テクスチャはシード付き乳白乱数で生成するため、複数回呼んでも同一画像になる
 * （元画像と処理後画像で同じ入力を使うため）。
 */

export type SourceImageType =
  | 'geometric'
  | 'portrait'
  | 'checker'
  | 'gradient'
  | 'texture'

const SIZE = 200

function createCtx(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  return { canvas, ctx }
}

/** 幾何図形画像：黒→白グラデーション背景＋赤矩形・青円・緑三角 */
export function generateGeometricImage(): ImageData {
  const { ctx } = createCtx()
  const w = SIZE
  const h = SIZE

  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#000000')
  grad.addColorStop(1, '#ffffff')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgb(220, 50, 50)'
  ctx.fillRect(w * 0.12, h * 0.12, w * 0.32, h * 0.32)

  ctx.fillStyle = 'rgb(50, 80, 220)'
  ctx.beginPath()
  ctx.arc(w * 0.68, h * 0.58, Math.min(w, h) * 0.18, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgb(60, 200, 90)'
  ctx.beginPath()
  ctx.moveTo(w * 0.5, h * 0.55)
  ctx.lineTo(w * 0.88, h * 0.95)
  ctx.lineTo(w * 0.28, h * 0.95)
  ctx.closePath()
  ctx.fill()

  return ctx.getImageData(0, 0, w, h)
}

/** 人物風画像：背景グラデーション＋肌色の顔楕円＋黒の目鼻口 */
export function generatePortraitImage(): ImageData {
  const { ctx } = createCtx()
  const w = SIZE
  const h = SIZE

  // 背景（淡い青→白の縦グラデーション）
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#bfdbfe')
  bg.addColorStop(1, '#f8fafc')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // 顔（肌色の楕円）
  ctx.fillStyle = 'rgb(240, 200, 170)'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h * 0.52, w * 0.26, h * 0.32, 0, 0, Math.PI * 2)
  ctx.fill()

  // 目
  ctx.fillStyle = 'rgb(20, 20, 20)'
  ctx.beginPath()
  ctx.ellipse(w * 0.4, h * 0.46, w * 0.04, h * 0.05, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(w * 0.6, h * 0.46, w * 0.04, h * 0.05, 0, 0, Math.PI * 2)
  ctx.fill()

  // 鼻
  ctx.strokeStyle = 'rgb(180, 140, 110)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(w * 0.5, h * 0.52)
  ctx.lineTo(w * 0.47, h * 0.6)
  ctx.lineTo(w * 0.52, h * 0.6)
  ctx.stroke()

  // 口
  ctx.strokeStyle = 'rgb(150, 60, 60)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(w * 0.5, h * 0.66, w * 0.1, 0.15 * Math.PI, 0.85 * Math.PI)
  ctx.stroke()

  return ctx.getImageData(0, 0, w, h)
}

/** チェッカーボード：8×8 マスの白黒 */
export function generateCheckerImage(): ImageData {
  const { ctx } = createCtx()
  const cells = 8
  const cell = SIZE / cells

  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const isWhite = (row + col) % 2 === 0
      ctx.fillStyle = isWhite ? '#ffffff' : '#000000'
      ctx.fillRect(col * cell, row * cell, cell, cell)
    }
  }

  return ctx.getImageData(0, 0, SIZE, SIZE)
}

/** RGB各方向グラデーション：R は横、G は縦、B は逆対角に変化 */
export function generateGradientImage(): ImageData {
  const { ctx } = createCtx()
  const w = SIZE
  const h = SIZE
  const img = ctx.createImageData(w, h)
  const data = img.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      data[i] = Math.round((x / (w - 1)) * 255)        // R: 横方向
      data[i + 1] = Math.round((y / (h - 1)) * 255)    // G: 縦方向
      data[i + 2] = Math.round((1 - x / (w - 1)) * 255) // B: 横の逆方向
      data[i + 3] = 255
    }
  }

  return img
}

/** ノイズテクスチャ：シード付き乱数による明暗パターン（決定的） */
export function generateTextureImage(): ImageData {
  const { ctx } = createCtx()
  const w = SIZE
  const h = SIZE
  const img = ctx.createImageData(w, h)
  const data = img.data

  // mulberry32（固定シードで毎回同じ結果）
  let seed = 0x9e3779b9
  const rand = () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.round(rand() * 255)
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 255
  }

  return img
}

/** sourceImage 文字列に応じてテスト画像を生成する（省略時は geometric） */
export function generateSourceImage(type: string = 'geometric'): ImageData {
  switch (type) {
    case 'portrait':
      return generatePortraitImage()
    case 'checker':
      return generateCheckerImage()
    case 'gradient':
      return generateGradientImage()
    case 'texture':
      return generateTextureImage()
    case 'geometric':
    default:
      return generateGeometricImage()
  }
}
