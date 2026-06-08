/** テスト用の ImageData をノード環境で生成するヘルパー */
export function makeImageData(pixels: number[][], width?: number): ImageData {
  const w = width ?? pixels[0].length / 4
  const h = pixels.length
  const flat = new Uint8ClampedArray(pixels.flat())
  return { data: flat, width: w, height: h } as unknown as ImageData
}

/**
 * w×h の単色 RGBA 画像を作る。
 * color: [r, g, b, a]
 */
export function solidImage(w: number, h: number, color: [number, number, number, number]): ImageData {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h * 4; i += 4) {
    data[i]     = color[0]
    data[i + 1] = color[1]
    data[i + 2] = color[2]
    data[i + 3] = color[3]
  }
  return { data, width: w, height: h } as unknown as ImageData
}

/** ピクセル [x, y] の RGBA を返す */
export function getPixel(img: ImageData, x: number, y: number): [number, number, number, number] {
  const i = (y * img.width + x) * 4
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]]
}
