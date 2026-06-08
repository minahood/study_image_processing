import type { Quiz } from './toneCurve'
import toneCurveQuizzes from './toneCurve'
import kernelQuizzes from './kernel'
import thresholdQuizzes from './threshold'

export type { Quiz } from './toneCurve'

export { default as toneCurveQuizzes } from './toneCurve'
export { default as kernelQuizzes } from './kernel'
export { default as thresholdQuizzes } from './threshold'

/** 全カテゴリのクイズを結合した配列 */
export const allQuizzes: Quiz[] = [
  ...toneCurveQuizzes,
  ...kernelQuizzes,
  ...thresholdQuizzes,
]
