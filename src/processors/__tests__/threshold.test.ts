import { describe, it, expect } from 'vitest'
import { applyThreshold, otsuThreshold } from '../threshold'
import { solidImage, getPixel } from './helpers'

/** グレー値 v の 1×1 画像を作る */
function gray1x1(v: number): ImageData {
  return solidImage(1, 1, [v, v, v, 255])
}

describe('applyThreshold - fixed', () => {
  it('閾値より大きいピクセルは白になる', () => {
    const img = gray1x1(200)
    const out = applyThreshold(img, 'fixed', 128)
    expect(getPixel(out, 0, 0)).toEqual([255, 255, 255, 255])
  })

  it('閾値以下のピクセルは黒になる', () => {
    const img = gray1x1(50)
    const out = applyThreshold(img, 'fixed', 128)
    expect(getPixel(out, 0, 0)).toEqual([0, 0, 0, 255])
  })

  it('value 省略時は閾値 128 を使う', () => {
    const imgAbove = gray1x1(200)  // 128 との境界を避けて明確に上
    const imgBelow = gray1x1(50)   // 明確に下
    expect(getPixel(applyThreshold(imgAbove, 'fixed'), 0, 0)[0]).toBe(255)
    expect(getPixel(applyThreshold(imgBelow, 'fixed'), 0, 0)[0]).toBe(0)
  })

  it('アルファは変化しない', () => {
    const img = solidImage(1, 1, [100, 100, 100, 77])
    const out = applyThreshold(img, 'fixed', 0)
    expect(getPixel(out, 0, 0)[3]).toBe(77)
  })
})

describe('applyThreshold - otsu', () => {
  it('暗い領域と明るい領域が混在する画像で閾値がその間に来る', () => {
    // 4ピクセル: 輝度 50 が 2 個、輝度 200 が 2 個
    const data = new Uint8ClampedArray([
      50,  50,  50,  255,
      50,  50,  50,  255,
      200, 200, 200, 255,
      200, 200, 200, 255,
    ])
    const img = { data, width: 4, height: 1 } as unknown as ImageData
    const t = otsuThreshold(img)
    // 閾値は 50 以上・200 未満（暗クラスを 0..t、明クラスを t+1..255 に分割）
    expect(t).toBeGreaterThanOrEqual(50)
    expect(t).toBeLessThanOrEqual(200)

    const out = applyThreshold(img, 'otsu')
    // 暗ピクセル（輝度50）は黒、明ピクセル（輝度200）は白
    expect(getPixel(out, 0, 0)[0]).toBe(0)
    expect(getPixel(out, 2, 0)[0]).toBe(255)
  })

  it('完全に単色の画像では全ピクセルが同じ値になる', () => {
    const img = solidImage(3, 3, [128, 128, 128, 255])
    const out = applyThreshold(img, 'otsu')
    const val = getPixel(out, 0, 0)[0]
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        expect(getPixel(out, x, y)[0]).toBe(val)
      }
    }
  })
})
