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
    explanation: '移動平均フィルタ（ボックスブラー）は全要素が1/9の均等な重みで画像を平滑化します。ガウシアンより均一なぼけ方になり、輪郭がはっきり失われます。',
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
    explanation: 'ガウシアンカーネルは中心(4)に重みを集中させた重み付き平均です。移動平均より自然な滑らかさになります。中心から離れるほど重みが小さくなる点が特徴です。',
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
    explanation: '上下左右(-1)・中心(5)の鮮鋭化カーネルです。重みの合計が1なので全体の明るさは変わらず、輪郭だけが強調されます。ラプラシアン(重み合計0)とは異なり階調が保たれます。',
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
    explanation: '周囲8画素すべて(-1)・中心(9)の全方向鮮鋭化カーネルです。4近傍(中心5)より強いエッジ強調になります。斜め方向の変化も捉えるためより鮮明になります。',
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
    explanation: 'ラプラシアンは2次微分フィルタで重みの合計が0です。平坦部はグレー(128)、エッジ部分のみが明暗として現れます。全方向のエッジを同時に検出できる点がSobelと異なります。',
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
    explanation: 'Sobel Xは左右の輝度差を求める1次微分フィルタです。縦方向（垂直）のエッジが強調されます。左列(-1,-2,-1)と右列(+1,+2,+1)が対称で中央列はすべて0です。',
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
