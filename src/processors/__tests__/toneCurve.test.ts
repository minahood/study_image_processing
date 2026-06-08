import { describe, it, expect } from 'vitest'
import { applyToneCurve } from '../toneCurve'
import { solidImage, getPixel } from './helpers'

describe('applyToneCurve', () => {
  it('制御点なしのとき画像を変化させない', () => {
    const img = solidImage(2, 2, [100, 150, 200, 255])
    const out = applyToneCurve(img, 'rgb', [])
    expect(getPixel(out, 0, 0)).toEqual([100, 150, 200, 255])
  })

  it('channel=rgb で全チャンネルを同じカーブで変換する', () => {
    const img = solidImage(2, 2, [128, 128, 128, 255])
    // 全域を反転するカーブ: in=0→out=255, in=255→out=0
    const out = applyToneCurve(img, 'rgb', [{ in: 0, out: 255 }, { in: 255, out: 0 }])
    const [r, g, b, a] = getPixel(out, 0, 0)
    expect(r).toBe(127)
    expect(g).toBe(127)
    expect(b).toBe(127)
    expect(a).toBe(255)
  })

  it('channel=r のとき G・B は変化しない', () => {
    const img = solidImage(2, 2, [100, 100, 100, 255])
    // R を 255 に飛ばすカーブ
    const out = applyToneCurve(img, 'r', [{ in: 0, out: 255 }, { in: 255, out: 255 }])
    const [r, g, b] = getPixel(out, 0, 0)
    expect(r).toBe(255)
    expect(g).toBe(100)
    expect(b).toBe(100)
  })

  it('制御点1点のとき全ピクセルがその out 値になる', () => {
    const img = solidImage(3, 3, [50, 80, 200, 255])
    const out = applyToneCurve(img, 'rgb', [{ in: 128, out: 200 }])
    const [r] = getPixel(out, 1, 1)
    expect(r).toBe(200)
  })

  it('アルファチャンネルは変化しない', () => {
    const img = solidImage(2, 2, [0, 0, 0, 128])
    const out = applyToneCurve(img, 'rgb', [{ in: 0, out: 255 }, { in: 255, out: 0 }])
    expect(getPixel(out, 0, 0)[3]).toBe(128)
  })

  it('出力値は 0–255 にクランプされる', () => {
    const img = solidImage(1, 1, [255, 255, 255, 255])
    const out = applyToneCurve(img, 'rgb', [{ in: 0, out: 0 }, { in: 255, out: 255 }])
    const [r] = getPixel(out, 0, 0)
    expect(r).toBeGreaterThanOrEqual(0)
    expect(r).toBeLessThanOrEqual(255)
  })
})
