import type { Quiz } from './types'
import { KERNELS } from '../processors'

const CATEGORY = 'カーネルフィルタ（逆問題）'

const SHARPEN_ALL: readonly (readonly number[])[] = [
  [-1, -1, -1],
  [-1,  9, -1],
  [-1, -1, -1],
] as const

// Kernel matrix text representations (compact format for 150px card)
const KM = {
  boxBlur3:
    ' 1   1   1\n 1   1   1  ×1/9\n 1   1   1',
  gaussian3:
    ' 1   2   1\n 2   4   2  ×1/16\n 1   2   1',
  sharpen:
    ' 0  -1   0\n-1   5  -1\n 0  -1   0',
  sharpenAll:
    '-1  -1  -1\n-1   9  -1\n-1  -1  -1',
  laplacian:
    ' 0   1   0\n 1  -4   1\n 0   1   0',
  sobelX:
    '-1   0   1\n-2   0   2\n-1   0   1',
  sobelY:
    '-1  -2  -1\n 0   0   0\n 1   2   1',
}

export const kernelReverseQuizzes: Quiz[] = [
  {
    id: 'k-r-01',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'bud',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 }, kernelMatrix: KM.boxBlur3, description: '移動平均' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, kernelMatrix: KM.gaussian3, description: 'ガウシアン' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, kernelMatrix: KM.sharpen, description: '鮮鋭化' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, kernelMatrix: KM.laplacian, description: 'ラプラシアン' },
    ],
    answer: 0,
    explanation: '出力は元の絵柄が残ったまま全体が均一にぼけているので平滑化カーネルです。全要素1/9の移動平均（A）はガウシアン（B）より均一なぼけ方になります。鮮鋭化（C）は逆に輪郭が際立つので不適、ラプラシアン（D）は重み合計0でグレー地にエッジ線だけが残り元画像が消えるため、ぼけた出力にはなりません。',
  },
  {
    id: 'k-r-02',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'bud',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, kernelMatrix: KM.sharpen, description: '鮮鋭化' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 }, kernelMatrix: KM.boxBlur3, description: '移動平均' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, kernelMatrix: KM.sobelX, description: 'Sobel X' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, kernelMatrix: KM.gaussian3, description: 'ガウシアン' },
    ],
    answer: 3,
    explanation: '出力は自然に滑らかにぼけているので重み付き平均のガウシアン（D）です。移動平均（B）も平滑化ですが均一すぎるぼけ方になり、中心ほど重みが大きいガウシアンの方が自然です。鮮鋭化（A）は逆に輪郭を強調、Sobel X（C）は縦エッジだけをグレー地に出すエッジ抽出なので、ぼけた出力には一致しません。',
  },
  {
    id: 'k-r-03',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'momiji',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, kernelMatrix: KM.gaussian3, description: 'ガウシアン' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, kernelMatrix: KM.sharpen, description: '鮮鋭化（4近傍）' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, kernelMatrix: KM.laplacian, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 }, kernelMatrix: KM.boxBlur3, description: '移動平均' },
    ],
    answer: 1,
    explanation: '出力は元の絵柄が残ったまま輪郭がくっきりしているので鮮鋭化（B、中心5・上下左右−1）です。重み合計1で明るさが保たれます。ガウシアン（A）と移動平均（D）は逆にぼけるため不適、ラプラシアン（C）は重み合計0でグレー地にエッジ線だけが残り元画像が消えるため、絵柄が残って輪郭が立つ出力には一致しません。',
  },
  {
    id: 'k-r-04',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'momiji',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: SHARPEN_ALL } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, kernelMatrix: KM.sharpen, description: '鮮鋭化（4近傍）' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: SHARPEN_ALL }, kernelMatrix: KM.sharpenAll, description: '鮮鋭化（8近傍）' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, kernelMatrix: KM.laplacian, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, kernelMatrix: KM.gaussian3, description: 'ガウシアン' },
    ],
    answer: 1,
    explanation: '出力は輪郭が非常に強く立ち斜め方向のエッジも際立っているので8近傍の全方向鮮鋭化（B、中心9）です。4近傍の鮮鋭化（A、中心5）でも輪郭は立ちますが斜め方向への効きが弱く強調も穏やかです。ガウシアン（D）は逆にぼけるため不適、ラプラシアン（C）はグレー地にエッジ線だけが残り元画像が消えるため、絵柄が残って強く鮮鋭化された出力とは異なります。',
  },
  {
    id: 'k-r-05',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'shapes',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, kernelMatrix: KM.sobelX, description: 'Sobel X' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, kernelMatrix: KM.gaussian3, description: 'ガウシアン' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, kernelMatrix: KM.laplacian, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, kernelMatrix: KM.sharpen, description: '鮮鋭化' },
    ],
    answer: 2,
    explanation: '出力はグレー地に全方向のエッジ線だけが浮かんでいるので重み合計0のラプラシアン（C）です。Sobel X（A）は縦エッジだけと方向に偏りがあり全方向均等のラプラシアンとは異なります。鮮鋭化（D）は元画像を残して輪郭を強めるだけ、ガウシアン（B）は元画像をぼかすだけなので、いずれも元の絵柄が消えてグレー地に線が出る出力には一致しません。',
  },
  {
    id: 'k-r-06',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'shapes',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, kernelMatrix: KM.laplacian, description: 'ラプラシアン' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelY }, kernelMatrix: KM.sobelY, description: 'Sobel Y' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, kernelMatrix: KM.gaussian3, description: 'ガウシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, kernelMatrix: KM.sobelX, description: 'Sobel X' },
    ],
    answer: 3,
    explanation: '出力はグレー地に縦方向のエッジだけが現れているので左右差を取るSobel X（D）です。左列(-1,-2,-1)と右列(+1,+2,+1)が対称で中央列は0です。Sobel Y（B）は横エッジだけが出て向きが直交、ラプラシアン（A）は全方向のエッジが出て偏りがありません。ガウシアン（C）はぼかすだけでエッジ線が出ないため不適です。',
  },
  {
    id: 'k-r-07',
    category: CATEGORY,
    question: 'この処理結果を得るために適用されたカーネルはどれか？',
    sourceImage: 'shapes',
    outputDisplay: { processorFn: 'applyKernel', params: { kernel: KERNELS.sobelY } },
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelY }, kernelMatrix: KM.sobelY, description: 'Sobel Y' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, kernelMatrix: KM.sobelX, description: 'Sobel X' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 }, kernelMatrix: KM.boxBlur3, description: '移動平均' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, kernelMatrix: KM.laplacian, description: 'ラプラシアン' },
    ],
    answer: 0,
    explanation: 'Sobel Yは上下の輝度差を求める1次微分フィルタです。横方向（水平）のエッジが強調されます。上行(-1,-2,-1)と下行(+1,+2,+1)が対称で中央行はすべて0です。Sobel Xと90度直交する方向のエッジを検出します。',
  },
]

export default kernelReverseQuizzes
