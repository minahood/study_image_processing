import { describe, it, expect } from 'vitest'
import toneCurveQuizzes from '../toneCurve'

describe('toneCurveQuizzes', () => {
  it('5問定義されている', () => {
    expect(toneCurveQuizzes).toHaveLength(5)
  })

  it('id が一意である', () => {
    const ids = toneCurveQuizzes.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('各問題の choices がちょうど4択である', () => {
    for (const q of toneCurveQuizzes) {
      expect(q.choices).toHaveLength(4)
    }
  })

  it('answer が choices の範囲内（0–3）である', () => {
    for (const q of toneCurveQuizzes) {
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(q.choices.length)
    }
  })

  it('processorFn がすべて applyToneCurve である', () => {
    for (const q of toneCurveQuizzes) {
      expect(q.processorFn).toBe('applyToneCurve')
    }
  })

  it('params に channel と curvePoints が含まれる', () => {
    for (const q of toneCurveQuizzes) {
      const p = q.params as Record<string, unknown>
      expect(p).toHaveProperty('channel')
      expect(p).toHaveProperty('curvePoints')
      expect(Array.isArray(p['curvePoints'])).toBe(true)
    }
  })

  it('各 curvePoint が in/out プロパティを持ち 0–255 の範囲である', () => {
    for (const q of toneCurveQuizzes) {
      const p = q.params as { curvePoints: { in: number; out: number }[] }
      for (const pt of p.curvePoints) {
        expect(pt.in).toBeGreaterThanOrEqual(0)
        expect(pt.in).toBeLessThanOrEqual(255)
        expect(pt.out).toBeGreaterThanOrEqual(0)
        expect(pt.out).toBeLessThanOrEqual(255)
      }
    }
  })

  it('category がすべて同じ', () => {
    const cats = new Set(toneCurveQuizzes.map((q) => q.category))
    expect(cats.size).toBe(1)
  })
})
