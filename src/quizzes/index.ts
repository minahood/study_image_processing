export type { Quiz, QuizChoice } from './types'

export { default as toneCurveQuizzes } from './toneCurve'
export { default as kernelQuizzes } from './kernel'
export { default as thresholdQuizzes } from './threshold'
export { default as geometricQuizzes } from './geometric'
export { default as realImageQuizzes } from './realImage'
export { default as kernelReverseQuizzes } from './kernelReverse'
export { default as fourierQuizzes } from './fourier'
export { default as frequencyQuizzes } from './frequency'

import toneCurveQuizzes from './toneCurve'
import kernelQuizzes from './kernel'
import thresholdQuizzes from './threshold'
import geometricQuizzes from './geometric'
import realImageQuizzes from './realImage'
import kernelReverseQuizzes from './kernelReverse'
import fourierQuizzes from './fourier'
import frequencyQuizzes from './frequency'

/** 全カテゴリのクイズを結合した配列 */
export const allQuizzes = [
  ...toneCurveQuizzes,
  ...kernelQuizzes,
  ...thresholdQuizzes,
  ...geometricQuizzes,
  ...realImageQuizzes,
  ...kernelReverseQuizzes,
  ...fourierQuizzes,
  ...frequencyQuizzes,
]
