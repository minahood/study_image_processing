export type Channel = 'r' | 'g' | 'b' | 'rgb'

export interface CurvePoint {
  in: number   // 0–255
  out: number  // 0–255
}

/**
 * 入力値 x に対して、制御点リストからスプライン補間でトーンカーブを適用する。
 * 制御点が1点以下の場合はそのまま返す。
 */
function interpolateCurve(x: number, points: CurvePoint[]): number {
  if (points.length === 0) return x
  if (points.length === 1) return points[0].out

  const sorted = [...points].sort((a, b) => a.in - b.in)

  if (x <= sorted[0].in) return sorted[0].out
  if (x >= sorted[sorted.length - 1].in) return sorted[sorted.length - 1].out

  for (let i = 0; i < sorted.length - 1; i++) {
    const p0 = sorted[i]
    const p1 = sorted[i + 1]
    if (x >= p0.in && x <= p1.in) {
      const t = (x - p0.in) / (p1.in - p0.in)
      return Math.round(p0.out + t * (p1.out - p0.out))
    }
  }

  return x
}

/**
 * 指定チャンネルにトーンカーブを適用する。
 * channel='rgb' の場合は R・G・B すべてに同じカーブを適用する。
 */
export function applyToneCurve(
  imageData: ImageData,
  channel: Channel,
  curvePoints: CurvePoint[],
): ImageData {
  // 0–255 の LUT を事前計算
  const lut = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.max(0, Math.min(255, interpolateCurve(i, curvePoints)))
  }

  const src = imageData.data
  const out = new Uint8ClampedArray(src)
  const len = src.length

  for (let i = 0; i < len; i += 4) {
    if (channel === 'r' || channel === 'rgb') out[i]     = lut[src[i]]
    if (channel === 'g' || channel === 'rgb') out[i + 1] = lut[src[i + 1]]
    if (channel === 'b' || channel === 'rgb') out[i + 2] = lut[src[i + 2]]
    // alpha はそのまま
    out[i + 3] = src[i + 3]
  }

  return new ImageData(out, imageData.width, imageData.height)
}
