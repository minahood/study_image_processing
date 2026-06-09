import type { Quiz } from './types'
import { KERNELS } from '../processors'

const CATEGORY = 'カーネルフィルタ'

export const kernelQuizzes: Quiz[] = [
  {
    id: 'k-01',
    category: CATEGORY,
    question: '3×3の全要素が均等な平均化カーネル（ボックスブラー）を適用した結果はどれ？',
    sourceImage: 'checker',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: 'ボックスブラー（平滑化）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: 'シャープネス強調',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン（エッジ検出）',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X（水平微分）',
      },
    ],
    answer: 0,
    explanation:
      'ボックスブラーは近傍9画素の平均値を使って平滑化します。市松模様のような高周波成分がならされてぼやけ、境界が灰色になります。シャープネスは逆に輪郭を強調し、ラプラシアン・Sobelはエッジを検出します。',
  },
  {
    id: 'k-02',
    category: CATEGORY,
    question: '中心に重みを置いたガウシアンカーネルを適用した結果はどれ？',
    sourceImage: 'portrait',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelY },
        description: 'Sobel Y（垂直微分）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: 'シャープネス強調',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアンぼかし',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン（エッジ検出）',
      },
    ],
    answer: 2,
    explanation:
      'ガウシアンカーネルは中心ほど重みが大きく、周辺に向かって重みが小さくなります。ボックスブラーより自然で滑らかなぼかしになり、ノイズ除去に広く使われます。',
  },
  {
    id: 'k-03',
    category: CATEGORY,
    question: '中心画素を強調し周囲を引く鮮鋭化カーネルを適用した結果はどれ？',
    sourceImage: 'portrait',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアンぼかし',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: 'ボックスブラー',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: 'シャープネス強調',
      },
    ],
    answer: 3,
    explanation:
      '鮮鋭化カーネルは中心の重み(5)で元画素を強め、上下左右(-1)を引くことで局所的な差異を拡大します。重みの合計が1なので明るさは保たれたまま輪郭が際立ちます。',
  },
  {
    id: 'k-04',
    category: CATEGORY,
    question: 'ラプラシアンカーネルを適用した結果はどれ？エッジ部分が浮き出て平坦部は灰色になる。',
    sourceImage: 'geometric',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン（エッジ検出）',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: 'ボックスブラー',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: 'シャープネス強調',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアンぼかし',
      },
    ],
    answer: 0,
    explanation:
      'ラプラシアンは2次微分に相当するエッジ検出フィルタです。重みの合計が0のため、輝度変化のない平坦部は0（灰色オフセット+128）となり、エッジ部分だけが明暗として浮き出ます。',
  },
  {
    id: 'k-05',
    category: CATEGORY,
    question: 'Sobel Xカーネルを適用した結果はどれ？左右方向の輝度変化（垂直エッジ）が強調される。',
    sourceImage: 'geometric',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアンぼかし',
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
      'Sobel Xは左右の輝度差を計算する微分フィルタです。縦方向（垂直）のエッジが強く検出されます。Sobel Yは上下方向の差分を取り水平エッジを検出し、ラプラシアンは全方向のエッジを同時に検出します。',
  },
  {
    id: 'k-06',
    category: CATEGORY,
    question: 'Sobel Yカーネルを適用した結果はどれ？上下方向の輝度変化（水平エッジ）が強調される。',
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
        description: 'シャープネス強調',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.boxBlur3 },
        description: 'ボックスブラー',
      },
    ],
    answer: 1,
    explanation:
      'Sobel Yは垂直方向（上下）の輝度差を計算します。水平方向（横）のエッジが強く検出されます。Sobel Xと90度直交する向きのエッジを検出するため、縦線と横線で異なるフィルタが応答します。',
  },
  {
    id: 'k-07',
    category: CATEGORY,
    question: 'チェッカーボードにガウシアンカーネルを適用した結果はどれ？',
    sourceImage: 'checker',
    choices: [
      {
        label: 'A',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sharpen },
        description: 'シャープネス強調',
      },
      {
        label: 'B',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.laplacian },
        description: 'ラプラシアン（エッジ検出）',
      },
      {
        label: 'C',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.sobelX },
        description: 'Sobel X',
      },
      {
        label: 'D',
        processorFn: 'applyKernel',
        params: { kernel: KERNELS.gaussian3 },
        description: 'ガウシアンぼかし',
      },
    ],
    answer: 3,
    explanation:
      'ガウシアンカーネルは中心に近い画素ほど重みが大きいため、市松模様の境界が滑らかにぼやけます。ボックスブラーよりも自然な滑らかさになります。シャープネスは逆に境界を強調し、エッジ検出フィルタは境界のみを抽出します。',
  },
]

export default kernelQuizzes
