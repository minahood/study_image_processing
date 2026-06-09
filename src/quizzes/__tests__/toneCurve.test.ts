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

  it('各 choice の processorFn がすべて applyToneCurve である', () => {
    for (const q of toneCurveQuizzes) {
      for (const c of q.choices) {
        expect(c.processorFn).toBe('applyToneCurve')
      }
    }
  })

  it('各 choice の params に channel と curvePoints が含まれる', () => {
    for (const q of toneCurveQuizzes) {
      for (const c of q.choices) {
        const p = c.params as Record<string, unknown>
        expect(p).toHaveProperty('channel')
        expect(p).toHaveProperty('curvePoints')
        expect(Array.isArray(p['curvePoints'])).toBe(true)
      }
    }
  })

  it('category がすべて同じ', () => {
    const cats = new Set(toneCurveQuizzes.map((q) => q.category))
    expect(cats.size).toBe(1)
  })
})
