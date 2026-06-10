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
      '全要素が 1/9 の移動平均フィルタは周辺9画素の単純平均を取り、画像を均等にぼかします（平滑化）。鮮鋭化（B）は逆に輪郭を強調してくっきりさせるため平滑化とは正反対、ラプラシアン（C）は重み合計0でグレー地にエッジ線だけが残り元画像が消える別物です。Sobel X（D）は縦の輪郭だけがグレー地に現れるため、元の絵柄が残ったまま全体がなめらかにぼけるボックスブラーと区別できます。',
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
      'ガウシアンカーネルは中心(4)ほど重みが大きく距離に応じて減るため、移動平均より自然で滑らかなぼかしになります（合計16で正規化）。移動平均（B）も平滑化ですがガウシアンより均一にぼけ、鮮鋭化（D）は逆に輪郭を際立たせるため正反対です。Sobel Y（A）は横の輪郭だけがグレー地に出るエッジ抽出で、元の絵柄が残ったまま柔らかくぼけるガウシアンとは見た目がまったく異なります。',
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
      '中心(5)、上下左右(-1)の鮮鋭化カーネルです。重みの合計は 5−4=1 なので明るさを保ちつつ輪郭を強調します（元画像＋ラプラシアン成分に相当）。ガウシアン（A）は逆にぼけてしまい鮮鋭化と正反対、ラプラシアン（B）は重み合計0でグレー地にエッジ線だけが残り元画像が消えます。Sobel X（D）は縦の輪郭だけのエッジ抽出で、元の絵柄が残ったまま全体がくっきりする鮮鋭化とは区別できます。',
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
      '中心(9)、周囲8方向すべて(-1)の全方向鮮鋭化カーネルです。重み合計は1で明るさを保ちつつ、上下左右のみの鮮鋭化（C、中心5）より斜め方向も含めて強くエッジを強調します。ガウシアン（A）と移動平均（B）はどちらも逆にぼけるため鮮鋭化と正反対で、C（4近傍）とは強調の強さと斜め方向への効き方で区別できます。過強調になりやすい点に注意します。',
  },
  {
    id: 'k-05',
    category: CATEGORY,
    question: LAPLACIAN_DISPLAY,
    sourceImage: 'shapes',
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
      '重み合計0のラプラシアンは2次微分フィルタで、平坦部はグレー(128)、全方向のエッジだけが明暗として浮き出ます。移動平均（B）とガウシアン（D）はどちらも平滑化で元画像をぼかすだけ、鮮鋭化（C）は元画像を残したまま輪郭を強めるため、いずれも元の絵柄が残る点でグレー地に線だけが出るラプラシアンと区別できます。Sobelと違い特定方向に偏らず全方向のエッジを同時に検出します。',
  },
  {
    id: 'k-06',
    category: CATEGORY,
    question: SOBEL_X_DISPLAY,
    sourceImage: 'shapes',
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
      'Sobel Xは左列(-1,-2,-1)と右列(+1,+2,+1)の差で左右方向の輝度変化を計算する1次微分フィルタで、縦方向（垂直）のエッジが強調されます。Sobel Y（B）は逆に横方向のエッジだけを出し向きが直交、ラプラシアン（D）は全方向のエッジを偏りなく検出します。ガウシアン（A）はエッジを出さずぼかすだけなので、縦線だけがグレー地に立つSobel Xと区別できます。',
  },
  {
    id: 'k-07',
    category: CATEGORY,
    question: SOBEL_Y_DISPLAY,
    sourceImage: 'shapes',
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
      'Sobel Yは上行(-1,-2,-1)と下行(+1,+2,+1)の差で上下方向の輝度変化を計算し、横方向（水平）のエッジが強調されます。Sobel X（A）は逆に縦方向のエッジだけを出し向きが直交する点で区別でき、鮮鋭化（C）と移動平均（D）はエッジ抽出ではなく元画像を強調／ぼかす処理なので、横線だけがグレー地に立つSobel Yとは見た目がまったく異なります。XとYを組み合わせてエッジ強度 √(X²+Y²) を求めることが多いです。',
  },
]

export default kernelQuizzes
