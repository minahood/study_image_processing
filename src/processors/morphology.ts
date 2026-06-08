/**
 * 形態学的処理（膨張・収縮）。二値化済み画像（ピクセル値が 0 か 255）を前提とする。
 * 構造要素は kernelSize × kernelSize の矩形（全 1）。
 */
export function morphology(
  imageData: ImageData,
  operation: 'dilate' | 'erode',
  kernelSize: number,
): ImageData {
  const { data: src, width, height } = imageData
  const out = new Uint8ClampedArray(src.length)
  const half = Math.floor(kernelSize / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let hit = operation === 'erode' ? true : false

      outer: for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const sy = Math.min(height - 1, Math.max(0, y + ky))
          const sx = Math.min(width - 1, Math.max(0, x + kx))
          const isFg = src[(sy * width + sx) * 4] === 255

          if (operation === 'dilate' && isFg) {
            hit = true
            break outer
          }
          if (operation === 'erode' && !isFg) {
            hit = false
            break outer
          }
        }
      }

      const dstIdx = (y * width + x) * 4
      const val = hit ? 255 : 0
      out[dstIdx]     = val
      out[dstIdx + 1] = val
      out[dstIdx + 2] = val
      out[dstIdx + 3] = src[dstIdx + 3]
    }
  }

  return new ImageData(out, width, height)
}
