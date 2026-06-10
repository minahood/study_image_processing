import type { Quiz } from './types'

const CATEGORY = '二値化・形態学処理'

export const thresholdQuizzes: Quiz[] = [
  {
    id: 't-01',
    category: CATEGORY,
    question: '大津法（Otsu）で二値化した結果はどれ？',
    sourceImage: 'momiji',
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
      '大津法はクラス間分散が最大になる閾値を全探索で自動決定し、前景と背景がバランスよく分かれます。固定閾値50（A）は閾値が低すぎてほとんどの画素が白（前景）になり背景がつぶれ、固定閾値200（C）は閾値が高すぎてごく明るい部分しか白にならず大半が黒になります。固定閾値128（D）は中間値で一見近い結果になりますが、紅葉のように分布が偏った画像では大津法が選ぶ最適閾値とずれ、前景の取り方が変わります。閾値の値が二値化結果をどう変えるかの理解が問われます。',
  },
  {
    id: 't-02',
    category: CATEGORY,
    question: '固定閾値128で二値化した結果はどれ？',
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
        params: { method: 'fixed', value: 160 },
        description: '固定閾値160',
      },
    ],
    answer: 0,
    explanation:
      '固定閾値128は輝度範囲の中間値で、グラデーション画像では黒白の境界がほぼ中央に来ます。閾値64（B）は低い輝度でも白になるため境界が左（暗側）に寄り白領域が広く、閾値192（C）は逆に境界が右に寄り白領域が狭くなります。閾値160（D）も128より境界がやや右寄りになり、白領域が128より狭くなる点で区別できます。閾値の大小と白黒の境界位置の対応を理解しているかが問われます。',
  },
  {
    id: 't-03',
    category: CATEGORY,
    question: '大津法で二値化後、3×3カーネルで膨張（dilate）した結果はどれ？',
    sourceImage: 'shapes',
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
      '膨張（dilate）は構造要素の範囲内に1つでも白画素があれば中心を白にする処理で、3×3カーネルでは白領域が1画素分外側に広がります。二値化のみ（A）は白領域が広がらず元の大きさのまま、収縮（erode、B）は逆に白領域が縮み細い線が消えるため、膨張とは正反対の見た目です。5×5膨張（C）は広がり方がより大きく、3×3より輪郭が太く丸まる点で区別できます。膨張・収縮の向きとカーネルサイズの効き方を理解しているかが問われます。',
  },
]

export default thresholdQuizzes
