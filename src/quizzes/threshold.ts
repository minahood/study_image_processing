import type { Quiz } from './types'

const CATEGORY = '二値化・形態学処理'

export const thresholdQuizzes: Quiz[] = [
  {
    id: 't-01',
    category: CATEGORY,
    question: '大津法（Otsu）で自動的に閾値を決めて二値化した結果はどれ？画像の輝度分布を分析して最適な閾値を選ぶ手法。',
    sourceImage: 'portrait',
    choices: [
      {
        label: 'A',
        processorFn: 'applyThreshold',
        params: { method: 'fixed', value: 50 },
        description: '固定閾値50（暗部のみ黒）',
      },
      {
        label: 'B',
        processorFn: 'applyThreshold',
        params: { method: 'otsu' },
        description: '大津法（自動閾値）',
      },
      {
        label: 'C',
        processorFn: 'applyThreshold',
        params: { method: 'fixed', value: 200 },
        description: '固定閾値200（明部のみ白）',
      },
      {
        label: 'D',
        processorFn: 'applyThreshold',
        params: { method: 'fixed', value: 128 },
        description: '固定閾値128（中間値）',
      },
    ],
    answer: 1,
    explanation:
      '大津法はクラス間分散が最大になる閾値を全探索で自動的に求めます。画像ごとに最適な閾値が決まるため、輝度分布に応じたバランスの良い二値化結果が得られます。固定閾値50では暗い部分しか黒にならず、200では明るい部分しか白になりません。',
  },
  {
    id: 't-02',
    category: CATEGORY,
    question: '固定閾値128で二値化した結果はどれ？輝度128より大きいピクセルを白、以下を黒にする。',
    sourceImage: 'gradient',
    choices: [
      {
        label: 'A',
        processorFn: 'applyThreshold',
        params: { method: 'fixed', value: 128 },
        description: '固定閾値128',
      },
      {
        label: 'B',
        processorFn: 'applyThreshold',
        params: { method: 'fixed', value: 64 },
        description: '固定閾値64（より暗く）',
      },
      {
        label: 'C',
        processorFn: 'applyThreshold',
        params: { method: 'fixed', value: 192 },
        description: '固定閾値192（より明るく）',
      },
      {
        label: 'D',
        processorFn: 'applyThreshold',
        params: { method: 'otsu' },
        description: '大津法（自動閾値）',
      },
    ],
    answer: 0,
    explanation:
      '固定閾値128は画像の輝度範囲の中間値です。グラデーション画像では概ね左半分が黒、右半分が白に二値化されます。閾値64ではより左側（暗い部分）が黒になる境界が左寄りになり、閾値192では右寄りになります。',
  },
  {
    id: 't-03',
    category: CATEGORY,
    question: '二値化後に膨張（dilate）処理を適用した結果はどれ？白い領域が外側に広がる。',
    sourceImage: 'geometric',
    choices: [
      {
        label: 'A',
        processorFn: 'applyThreshold',
        params: { method: 'otsu' },
        description: '二値化のみ（膨張なし）',
      },
      {
        label: 'B',
        processorFn: 'morphology',
        params: { operation: 'erode', kernelSize: 3 },
        description: '収縮（erode）',
      },
      {
        label: 'C',
        processorFn: 'morphology',
        params: { operation: 'dilate', kernelSize: 5 },
        description: '膨張（dilate、カーネル5×5）',
      },
      {
        label: 'D',
        processorFn: 'morphology',
        params: { operation: 'dilate', kernelSize: 3 },
        description: '膨張（dilate、カーネル3×3）',
      },
    ],
    answer: 3,
    explanation:
      '膨張（dilate）は構造要素の範囲内に1つでも白画素があれば中心を白にする処理です。3×3カーネルでは白い領域が1ピクセル分外側に広がります。収縮（erode）は逆に白い領域が縮み、5×5カーネルでの膨張はより大きく広がります。',
  },
]

export default thresholdQuizzes
