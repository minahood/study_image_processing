import { applyToneCurve, applyKernel, applyThreshold, morphology, applyFrequency, patternGray, patternSourceImage, powerSpectrumImage, imageDataToGray, fft2d, FOURIER_REAL_MAP, SYNTHETIC_PATTERNS } from './index'
import type { FreqParams } from './index'
import { translate, scale, rotate, flipHorizontal, flipVertical, scaleTranslate } from './geometric'
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
    case 'scaleTranslate': return scaleTranslate(source, p.sx, p.sy, p.tx, p.ty)
    case 'applyFrequency': return applyFrequency(source, p as FreqParams)
    case 'fourier': {
      const pattern = p.pattern as string
      if (SYNTHETIC_PATTERNS.has(pattern)) {
        return powerSpectrumImage(patternGray(pattern, 256), 256)
      }
      // For real image patterns, return blank (async path handles it)
      return new ImageData(256, 256)
    }
    default: return source
  }
}

function fourierSpectrumFromImageData(imageData: ImageData): ImageData {
  const N = imageData.width
  const gray = imageDataToGray(imageData)
  const re = new Float64Array(gray)
  const im = new Float64Array(N * N)
  fft2d(re, im, N, false)
  return powerSpectrumImage(gray, N)
}

export function processChoice(sourceImageType: string, choice: QuizChoice): ImageData {
  // pat_* types use synthetic pattern source (not generateSourceImage)
  if (sourceImageType.startsWith('pat_')) {
    const patKey = sourceImageType.slice(4)
    const source = patternSourceImage(patKey, 200)
    return applyChoice(source, choice)
  }
  const source = generateSourceImage(sourceImageType)
  return applyChoice(source, choice)
}

export async function processChoiceAsync(sourceImageType: string, choice: QuizChoice): Promise<ImageData> {
  // Special case: fourier spectrum of real image
  if (choice.processorFn === 'fourier') {
    const pattern = (choice.params as any).pattern as string
    if (!SYNTHETIC_PATTERNS.has(pattern)) {
      const realKey = FOURIER_REAL_MAP[pattern]
      if (realKey) {
        const img = await loadImage(realImagePath(realKey), 256, 256)
        return fourierSpectrumFromImageData(img)
      }
    }
    return powerSpectrumImage(patternGray(pattern, 256), 256)
  }

  let source: ImageData
  if (sourceImageType.startsWith('pat_')) {
    source = patternSourceImage(sourceImageType.slice(4), 200)
  } else if (isRealImage(sourceImageType)) {
    source = await loadImage(realImagePath(sourceImageType))
  } else {
    source = generateSourceImage(sourceImageType)
  }
  return applyChoice(source, choice)
}
