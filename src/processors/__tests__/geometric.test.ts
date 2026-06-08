import { describe, it, expect } from 'vitest'
import { translate, scale, rotate, flipHorizontal, flipVertical } from '../geometric'
import { getPixel } from './helpers'

/** w×h のテスト画像。各ピクセルに一意の色を入れて移動を追跡できるようにする */
function rampImage(w: number, h: number): ImageData {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      data[i] = x * 10
      data[i + 1] = y * 10
      data[i + 2] = 100
      data[i + 3] = 255
    }
  }
  return { data, width: w, height: h } as unknown as ImageData
}

describe('translate', () => {
  it('右に1pxずらすと元の(0,0)が(1,0)へ移り、左端は黒で埋まる', () => {
    const img = rampImage(4, 4)
    const out = translate(img, 1, 0)
    expect(getPixel(out, 1, 0)).toEqual([0, 0, 100, 255]) // 元(0,0)
    expect(getPixel(out, 0, 0)).toEqual([0, 0, 0, 255])   // 黒埋め
  })

  it('下に1pxずらすと上端が黒で埋まる', () => {
    const img = rampImage(4, 4)
    const out = translate(img, 0, 1)
    expect(getPixel(out, 0, 0)).toEqual([0, 0, 0, 255])
    expect(getPixel(out, 0, 1)).toEqual([0, 0, 100, 255])
  })
})

describe('scale', () => {
  it('2倍拡大で出力(2,0)は入力(1,0)由来になる', () => {
    const img = rampImage(4, 4)
    const out = scale(img, 2, 2)
    // 出力(2,2) -> floor(2/2)=1 -> 入力(1,1)
    expect(getPixel(out, 2, 2)).toEqual([10, 10, 100, 255])
  })

  it('0.5倍縮小では右下が黒で埋まる', () => {
    const img = rampImage(4, 4)
    const out = scale(img, 0.5, 0.5)
    // 出力(3,3) -> floor(3/0.5)=6 -> 範囲外 -> 黒
    expect(getPixel(out, 3, 3)).toEqual([0, 0, 0, 255])
  })
})

describe('rotate', () => {
  it('0度回転は画像を変化させない', () => {
    const img = rampImage(4, 4)
    const out = rotate(img, 0)
    expect(getPixel(out, 1, 2)).toEqual(getPixel(img, 1, 2))
  })

  it('360度回転は元と一致する', () => {
    const img = rampImage(5, 5)
    const out = rotate(img, 360)
    expect(getPixel(out, 2, 2)).toEqual(getPixel(img, 2, 2))
  })
})

describe('flipHorizontal', () => {
  it('左右が反転する', () => {
    const img = rampImage(4, 4)
    const out = flipHorizontal(img)
    expect(getPixel(out, 0, 0)).toEqual(getPixel(img, 3, 0))
    expect(getPixel(out, 3, 0)).toEqual(getPixel(img, 0, 0))
  })
})

describe('flipVertical', () => {
  it('上下が反転する', () => {
    const img = rampImage(4, 4)
    const out = flipVertical(img)
    expect(getPixel(out, 0, 0)).toEqual(getPixel(img, 0, 3))
    expect(getPixel(out, 0, 3)).toEqual(getPixel(img, 0, 0))
  })
})
