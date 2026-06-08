/**
 * 任意の畳み込みカーネルを画像に適用する（境界はクランプ）。
 * カーネルは奇数サイズ（3x3, 5x5 など）の2次元配列。
 * 正規化は呼び出し側の責任（カーネル要素の和が 0 の場合はオフセット 128 を加算しない）。
 */
export function applyKernel(
  imageData: ImageData,
  kernel: readonly (readonly number[])[],
): ImageData {
  const { width, height, data: src } = imageData
  const out = new Uint8ClampedArray(src.length)

  const kH = kernel.length
  const kW = kernel[0].length
  const halfH = Math.floor(kH / 2)
  const halfW = Math.floor(kW / 2)

  // カーネルの重みの合計（正規化係数）
  const kSum = kernel.flat().reduce((a, b) => a + b, 0)
  const normalize = kSum !== 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0

      for (let ky = 0; ky < kH; ky++) {
        for (let kx = 0; kx < kW; kx++) {
          // 境界クランプ
          const sy = Math.min(height - 1, Math.max(0, y + ky - halfH))
          const sx = Math.min(width - 1, Math.max(0, x + kx - halfW))
          const idx = (sy * width + sx) * 4
          const w = kernel[ky][kx]
          r += src[idx]     * w
          g += src[idx + 1] * w
          b += src[idx + 2] * w
        }
      }

      const dstIdx = (y * width + x) * 4
      if (normalize) {
        out[dstIdx]     = Math.max(0, Math.min(255, Math.round(r / kSum)))
        out[dstIdx + 1] = Math.max(0, Math.min(255, Math.round(g / kSum)))
        out[dstIdx + 2] = Math.max(0, Math.min(255, Math.round(b / kSum)))
      } else {
        // エッジ検出など合計が 0 のカーネル：絶対値＋128 オフセットで可視化
        out[dstIdx]     = Math.max(0, Math.min(255, Math.abs(Math.round(r)) + 128))
        out[dstIdx + 1] = Math.max(0, Math.min(255, Math.abs(Math.round(g)) + 128))
        out[dstIdx + 2] = Math.max(0, Math.min(255, Math.abs(Math.round(b)) + 128))
      }
      out[dstIdx + 3] = src[(y * width + x) * 4 + 3]
    }
  }

  return new ImageData(out, width, height)
}

// ---- よく使うカーネルのプリセット ----

export const KERNELS = {
  /** 3x3 平均平滑化 */
  boxBlur3: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  /** ガウシアンぼかし（近似） */
  gaussian3: [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ],
  /** シャープネス強調 */
  sharpen: [
    [ 0, -1,  0],
    [-1,  5, -1],
    [ 0, -1,  0],
  ],
  /** Laplacianエッジ検出 */
  laplacian: [
    [ 0,  1,  0],
    [ 1, -4,  1],
    [ 0,  1,  0],
  ],
  /** Sobelフィルタ（水平方向） */
  sobelX: [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ],
  /** Sobelフィルタ（垂直方向） */
  sobelY: [
    [-1, -2, -1],
    [ 0,  0,  0],
    [ 1,  2,  1],
  ],
} as const
