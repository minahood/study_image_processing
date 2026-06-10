/**
 * 幾何学変換プロセッサ（純粋関数）。
 * 出力サイズは入力と同じ。サンプリングは最近傍補間、
 * はみ出した領域は黒（0,0,0,255）で埋める。
 */

function blackCanvas(width: number, height: number): Uint8ClampedArray<ArrayBuffer> {
  const out = new Uint8ClampedArray(width * height * 4)
  // RGB=0、A=255 で初期化
  for (let i = 3; i < out.length; i += 4) {
    out[i] = 255
  }
  return out
}

/** 画素 (sx, sy) を dst の (dx, dy) にコピーする。範囲外なら何もしない（黒のまま） */
function copyPixel(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  sx: number,
  sy: number,
  dx: number,
  dy: number,
): void {
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return
  const si = (sy * width + sx) * 4
  const di = (dy * width + dx) * 4
  dst[di] = src[si]
  dst[di + 1] = src[si + 1]
  dst[di + 2] = src[si + 2]
  dst[di + 3] = src[si + 3]
}

/** 平行移動。dx>0 で右、dy>0 で下へ移動。空いた領域は黒。 */
export function translate(imageData: ImageData, dx: number, dy: number): ImageData {
  const { data: src, width, height } = imageData
  const out = blackCanvas(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 出力 (x,y) には入力 (x-dx, y-dy) が来る
      copyPixel(src, out, width, height, x - dx, y - dy, x, y)
    }
  }

  return new ImageData(out, width, height)
}

/** 拡大縮小（左上原点、最近傍補間）。sx,sy は倍率。 */
export function scale(imageData: ImageData, sx: number, sy: number): ImageData {
  const { data: src, width, height } = imageData
  const out = blackCanvas(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = Math.floor(x / sx)
      const srcY = Math.floor(y / sy)
      copyPixel(src, out, width, height, srcX, srcY, x, y)
    }
  }

  return new ImageData(out, width, height)
}

/** 回転（最近傍補間）。angleDeg は時計回りの角度。中心デフォルトは画像中央。 */
export function rotate(
  imageData: ImageData,
  angleDeg: number,
  cx?: number,
  cy?: number,
): ImageData {
  const { data: src, width, height } = imageData
  const out = blackCanvas(width, height)

  const centerX = cx ?? width / 2
  const centerY = cy ?? height / 2
  const rad = (angleDeg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 出力画素を逆回転して入力座標を求める
      const ox = x - centerX
      const oy = y - centerY
      const srcX = Math.round(centerX + ox * cos + oy * sin)
      const srcY = Math.round(centerY - ox * sin + oy * cos)
      copyPixel(src, out, width, height, srcX, srcY, x, y)
    }
  }

  return new ImageData(out, width, height)
}

/** 水平反転（左右反転） */
export function flipHorizontal(imageData: ImageData): ImageData {
  const { data: src, width, height } = imageData
  const out = blackCanvas(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      copyPixel(src, out, width, height, width - 1 - x, y, x, y)
    }
  }

  return new ImageData(out, width, height)
}

/**
 * 拡大縮小 + 平行移動の複合変換（左上原点）。
 * x' = sx*x + tx, y' = sy*y + ty
 */
export function scaleTranslate(
  imageData: ImageData,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): ImageData {
  const { data: src, width, height } = imageData
  const out = blackCanvas(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = Math.floor((x - tx) / sx)
      const srcY = Math.floor((y - ty) / sy)
      copyPixel(src, out, width, height, srcX, srcY, x, y)
    }
  }

  return new ImageData(out, width, height)
}

/** 垂直反転（上下反転） */
export function flipVertical(imageData: ImageData): ImageData {
  const { data: src, width, height } = imageData
  const out = blackCanvas(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      copyPixel(src, out, width, height, x, height - 1 - y, x, y)
    }
  }

  return new ImageData(out, width, height)
}
