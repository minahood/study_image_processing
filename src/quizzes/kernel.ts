import type { Quiz } from './toneCurve'
import { KERNELS } from '../processors'

const CATEGORY = 'カーネルフィルタ'

const kernelQuizzes: Quiz[] = [
  {
    id: 'k-01',
    category: CATEGORY,
    question:
      '次の 3×3 カーネル（すべての要素が 1）を画像に適用すると、どうなりますか？\n\n[1 1 1]\n[1 1 1]\n[1 1 1]',
    processorFn: 'applyKernel',
    params: { kernel: KERNELS.boxBlur3 },
    choices: [
      '画像が平滑化されて全体的にぼやける',
      '輪郭が強調されてくっきりする',
      'エッジだけが白く浮き出る',
      '色が反転する',
    ],
    answer: 0,
    explanation:
      'すべての要素が等しい平均化カーネル（ボックスブラー）です。近傍9画素の平均を取るため、細かい変化がならされて画像全体がぼやけます。',
  },
  {
    id: 'k-02',
    category: CATEGORY,
    question:
      '次の 3×3 カーネルを画像に適用すると、どうなりますか？\n\n[1 2 1]\n[2 4 2]\n[1 2 1]',
    processorFn: 'applyKernel',
    params: { kernel: KERNELS.gaussian3 },
    choices: [
      '画像が鮮鋭化されてシャープになる',
      '中心に重みを置いたガウス分布で自然にぼかされる',
      '斜めのエッジだけが抽出される',
      '明るさが2倍になる',
    ],
    answer: 1,
    explanation:
      '中心ほど重みが大きいガウシアンカーネルです。ボックスブラーより自然で滑らかなぼかしになり、ノイズ除去にも使われます。',
  },
  {
    id: 'k-03',
    category: CATEGORY,
    question:
      '次の 3×3 カーネルを画像に適用すると、どうなりますか？\n\n[ 0 -1  0]\n[-1  5 -1]\n[ 0 -1  0]',
    processorFn: 'applyKernel',
    params: { kernel: KERNELS.sharpen },
    choices: [
      '画像全体が暗くなる',
      'ぼやけて平滑化される',
      '中心を強調し隣接画素を引くことで輪郭が際立つ（鮮鋭化）',
      '色相が回転する',
    ],
    answer: 2,
    explanation:
      '中心の重み（5）で元画素を強め、上下左右を引く鮮鋭化（シャープ）カーネルです。重みの合計が1なので明るさは保たれたまま輪郭が強調されます。',
  },
  {
    id: 'k-04',
    category: CATEGORY,
    question:
      '次の 3×3 カーネル（ラプラシアン）を画像に適用すると、どうなりますか？\n\n[ 0  1  0]\n[ 1 -4  1]\n[ 0  1  0]',
    processorFn: 'applyKernel',
    params: { kernel: KERNELS.laplacian },
    choices: [
      '画像がぼける',
      '明るさが反転する',
      '彩度が上がる',
      'エッジ（輪郭）部分が抽出され、平坦な領域は灰色になる',
    ],
    answer: 3,
    explanation:
      '2次微分にあたるラプラシアンカーネルです。重みの合計が0なので、輝度変化のない平坦部は0（灰色オフセット）になり、エッジ部分だけが浮き出ます。',
  },
  {
    id: 'k-05',
    category: CATEGORY,
    question:
      '次の 3×3 カーネル（Sobel X）を画像に適用すると、どうなりますか？\n\n[-1 0 1]\n[-2 0 2]\n[-1 0 1]',
    processorFn: 'applyKernel',
    params: { kernel: KERNELS.sobelX },
    choices: [
      '横方向の輝度変化（垂直なエッジ）が検出される',
      '縦方向の輝度変化（水平なエッジ）が検出される',
      '画像が平滑化される',
      '画像全体が白くなる',
    ],
    answer: 0,
    explanation:
      'Sobel X は水平方向（左右）の輝度差を計算する微分フィルタです。左右で値が変わる箇所＝垂直なエッジが強く検出されます。',
  },
]

export default kernelQuizzes
