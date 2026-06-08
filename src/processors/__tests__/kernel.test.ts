import { describe, it, expect } from 'vitest'
import { applyKernel, KERNELS } from '../kernel'
import { solidImage, getPixel } from './helpers'

describe('applyKernel', () => {
  it('単位カーネル（中心1のみ）は画像を変化させない', () => {
    const identity = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
    const img = solidImage(4, 4, [120, 80, 40, 255])
    const out = applyKernel(img, identity)
    expect(getPixel(out, 1, 1)).toEqual([120, 80, 40, 255])
  })

  it('boxBlur3 で単色画像は同じ値を保つ', () => {
    const img = solidImage(5, 5, [200, 100, 50, 255])
    const out = applyKernel(img, KERNELS.boxBlur3)
    // 単色なら平均も同値
    const [r, g, b] = getPixel(out, 2, 2)
    expect(r).toBe(200)
    expect(g).toBe(100)
    expect(b).toBe(50)
  })

  it('gaussian3 で単色画像は同じ値を保つ', () => {
    const img = solidImage(5, 5, [160, 80, 40, 255])
    const out = applyKernel(img, KERNELS.gaussian3)
    const [r, g, b] = getPixel(out, 2, 2)
    expect(r).toBe(160)
    expect(g).toBe(80)
    expect(b).toBe(40)
  })

  it('sharpen で単色画像は変化しない（エッジなし）', () => {
    const img = solidImage(5, 5, [100, 100, 100, 255])
    const out = applyKernel(img, KERNELS.sharpen)
    const [r] = getPixel(out, 2, 2)
    expect(r).toBe(100)
  })

  it('laplacian（合計=0カーネル）で単色画像の中心は 128 になる', () => {
    // 均一画像はエッジなし → 重みつき和 = 0 → |0| + 128 = 128
    const img = solidImage(5, 5, [200, 200, 200, 255])
    const out = applyKernel(img, KERNELS.laplacian)
    const [r] = getPixel(out, 2, 2)
    expect(r).toBe(128)
  })

  it('アルファチャンネルは変化しない', () => {
    const img = solidImage(3, 3, [0, 0, 0, 200])
    const out = applyKernel(img, KERNELS.boxBlur3)
    expect(getPixel(out, 1, 1)[3]).toBe(200)
  })
})
