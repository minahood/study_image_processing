/**
 * 画像をグレースケール輝度に変換するための重み（ITU-R BT.601）
 */
function toLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/**
 * 大津の二値化：クラス間分散を最大化する閾値を全探索で求める。
 * 0–255 の最適閾値を返す。
 */
export function otsuThreshold(imageData: ImageData): number {
  const { data, width, height } = imageData
  const total = width * height

  // 輝度ヒストグラム
  const hist = new Float64Array(256)
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.round(toLuminance(data[i], data[i + 1], data[i + 2]))
    hist[lum]++
  }

  let bestThreshold = 0
  let bestVariance = 0

  let w0 = 0, sum0 = 0
  const sumAll = hist.reduce((acc, v, i) => acc + v * i, 0)

  for (let t = 0; t < 256; t++) {
    w0 += hist[t]
    if (w0 === 0) continue

    const w1 = total - w0
    if (w1 === 0) break

    sum0 += t * hist[t]
    const mu0 = sum0 / w0
    const mu1 = (sumAll - sum0) / w1

    const variance = (w0 / total) * (w1 / total) * (mu0 - mu1) ** 2
    if (variance > bestVariance) {
      bestVariance = variance
      bestThreshold = t
    }
  }

  return bestThreshold
}

/**
 * 画像を二値化する。
 * - method='otsu'  : 大津の手法で自動的に閾値を決定（value は無視）
 * - method='fixed' : value を閾値として使用（省略時は 128）
 *
 * 出力は白（255）か黒（0）のグレースケール画像（RGBA は変えない）。
 */
export function applyThreshold(
  imageData: ImageData,
  method: 'otsu' | 'fixed',
  value?: number,
): ImageData {
  const threshold =
    method === 'otsu' ? otsuThreshold(imageData) : (value ?? 128)

  const { data: src, width, height } = imageData
  const out = new Uint8ClampedArray(src.length)

  for (let i = 0; i < src.length; i += 4) {
    const lum = toLuminance(src[i], src[i + 1], src[i + 2])
    const bin = lum > threshold ? 255 : 0
    out[i]     = bin
    out[i + 1] = bin
    out[i + 2] = bin
    out[i + 3] = src[i + 3]
  }

  return new ImageData(out, width, height)
}
