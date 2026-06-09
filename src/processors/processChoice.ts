import { applyToneCurve, applyKernel, applyThreshold, morphology } from './index'
import { translate, scale, rotate, flipHorizontal, flipVertical } from './geometric'
import { generateSourceImage } from './testImages'
import { loadImage, isRealImage, realImagePath } from './imageLoader'
import type { QuizChoice } from '../quizzes'

function applyChoice(source: ImageData, choice: QuizChoice): ImageData {
  const p = choice.params as any
  switch (choice.processorFn) {
    case 'applyToneCurve': return applyToneCurve(source, p.channel, p.curvePoints)
    case 'applyKernel': return applyKernel(source, p.kernel)
    case 'applyThreshold': return applyThreshold(source, p.method, p.value)
    case 'morphology': {
      const binary = applyThreshold(source, 'otsu')
      return morphology(binary, p.operation, p.kernelSize)
    }
    case 'translate': return translate(source, p.dx, p.dy)
    case 'scale': return scale(source, p.sx, p.sy)
    case 'rotate': return rotate(source, p.angleDeg, p.cx, p.cy)
    case 'flipHorizontal': return flipHorizontal(source)
    case 'flipVertical': return flipVertical(source)
    default: return source
  }
}

export function processChoice(sourceImageType: string, choice: QuizChoice): ImageData {
  const source = generateSourceImage(sourceImageType)
  return applyChoice(source, choice)
}

export async function processChoiceAsync(sourceImageType: string, choice: QuizChoice): Promise<ImageData> {
  let source: ImageData
  if (isRealImage(sourceImageType)) {
    source = await loadImage(realImagePath(sourceImageType))
  } else {
    source = generateSourceImage(sourceImageType)
  }
  return applyChoice(source, choice)
}
