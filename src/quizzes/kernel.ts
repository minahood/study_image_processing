import type { Quiz } from './types'
import { KERNELS } from '../processors'

const CATEGORY = 'カーネルフィルタ'

// 移動平均フィルタのカーネル（各要素 1/9 ≈ 0.111）
const BOX_BLUR_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│  1   1   1   │
│  1   1   1   │ × 1/9
│  1   1   1   │
└───────────────┘`

const GAUSSIAN_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│  1   2   1   │
│  2   4   2   │ × 1/16
│  1   2   1   │
└───────────────┘`

const SHARPEN_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│  0  -1   0   │
│ -1   5  -1   │
│  0  -1   0   │
└───────────────┘`

const SHARPEN8_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│ -1  -1  -1   │
│ -1   9  -1   │
│ -1  -1  -1   │
└───────────────┘`

const LAPLACIAN_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│  0   1   0   │
│  1  -4   1   │
│  0   1   0   │
└───────────────┘`

const SOBEL_X_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│ -1   0   1   │
│ -2   0   2   │
│ -1   0   1   │
└───────────────┘`

const SOBEL_Y_DISPLAY = `以下のカーネルを画像に適用すると、出力はどうなるか？

┌───────────────┐
│ -1  -2  -1   │
│  0   0   0   │
│  1   2   1   │
└───────────────┘`

// 全方向シャープン（問題文の図5相当）
const SHARPEN_ALL: readonly (readonly number[])[] = [
  [-1, -1, -1],
  [-1,  9, -1],
  [-1, -1, -1],
] as const

export const kernelQuizzes: Quiz[] = [
  {
    id: 'k-01',
    category: CATEGORY,
    question: BOX_BLUR_DISPLAY,
    sourceImage: 'bud',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: '移動平均（平滑化）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: '鮮鋭化',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X（垂直エッジ）',
      },
    ],
    answer: 0,
    explanation:
      '全要素が 1/9 の移動平均フィルタは周辺9画素の単純平均を取り、画像を均等にぼかします（平滑化）。高周波成分（細かい模様やエッジ）が除去されてなめらかになります。',
  },
  {
    id: 'k-02',
    category: CATEGORY,
    question: GAUSSIAN_DISPLAY,
    sourceImage: 'bud',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelY },
        description: 'Sobel Y（水平エッジ）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: '移動平均（平滑化）',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアン平滑化',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: '鮮鋭化',
      },
    ],
    answer: 2,
    explanation:
      'ガウシアンカーネルは中心(4)ほど重みが大きく、距離に応じて重みが減ります。移動平均より自然で滑らかなぼかしになり、ノイズ除去に広く使われます。中心重み4・斜め重み1・上下左右重み2 → 合計16で正規化。',
  },
  {
    id: 'k-03',
    category: CATEGORY,
    question: SHARPEN_DISPLAY,
    sourceImage: 'momiji',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアン平滑化',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: '鮮鋭化（上下左右）',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X',
      },
    ],
    answer: 2,
    explanation:
      '中心(5)、上下左右(-1)の鮮鋭化カーネルです。重みの合計は 5-4=1 なので明るさを保ちつつエッジを強調します。「元画像 + ラプラシアン成分」に相当し、輪郭がくっきりします。',
  },
  {
    id: 'k-04',
    category: CATEGORY,
    question: SHARPEN8_DISPLAY,
    sourceImage: 'momiji',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアン平滑化',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: '移動平均',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: '鮮鋭化（上下左右）',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: SHARPEN_ALL },
        description: '鮮鋭化（8近傍）',
      },
    ],
    answer: 3,
    explanation:
      '中心(9)、周囲8方向すべて(-1)の全方向鮮鋭化カーネルです。上下左右のみのカーネル(中心5)よりも強くエッジを強調します。斜め方向のエッジも検出するため、より鮮明になりますが過強調になりやすいです。',
  },
  {
    id: 'k-05',
    category: CATEGORY,
    question: LAPLACIAN_DISPLAY,
    sourceImage: 'geometric',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン（全方向エッジ）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: '移動平均',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: '鮮鋭化',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアン平滑化',
      },
    ],
    answer: 0,
    explanation:
      '重みの合計が0のラプラシアンカーネルは2次微分フィルタです。輝度変化のない平坦部は0→グレー(128)で表示され、エッジ部分のみが明暗として浮き出ます。全方向のエッジを同時に検出できます。',
  },
  {
    id: 'k-06',
    category: CATEGORY,
    question: SOBEL_X_DISPLAY,
    sourceImage: 'geometric',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアン平滑化',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelY },
        description: 'Sobel Y（水平エッジ）',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X（垂直エッジ）',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン（全方向エッジ）',
      },
    ],
    answer: 2,
    explanation:
      'Sobel Xは左列(-1,-2,-1)と右列(+1,+2,+1)の差で左右方向（水平）の輝度変化を計算する1次微分フィルタです。縦方向（垂直）のエッジが強調されます。中央列がゼロで上下方向には応答しません。',
  },
  {
    id: 'k-07',
    category: CATEGORY,
    question: SOBEL_Y_DISPLAY,
    sourceImage: 'geometric',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X（垂直エッジ）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelY },
        description: 'Sobel Y（水平エッジ）',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: '鮮鋭化',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: '移動平均',
      },
    ],
    answer: 1,
    explanation:
      'Sobel Yは上行(-1,-2,-1)と下行(+1,+2,+1)の差で上下方向（垂直）の輝度変化を計算します。横方向（水平）のエッジが強調されます。Sobel XとYを組み合わせてエッジ強度 √(X²+Y²) を計算することが多いです。',
  },
]

export default kernelQuizzes
