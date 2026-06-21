import type { Quiz } from './types'

const CATEGORY = '周波数フィルタリング'

export const frequencyQuizzes: Quiz[] = [
  {
    id: 'fq-01',
    category: CATEGORY,
    question: '画像にガウシアン型ローパスフィルタ（σ=16）を周波数領域で適用した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyFrequency', params: { type: 'lowpass',     sigma: 16 },              description: 'ローパス σ=16（強いぼかし）' },
      { label: 'B', processorFn: 'applyFrequency', params: { type: 'highpass',    sigma: 14, gain: 1.4 },   description: 'ハイパス（輪郭抽出）' },
      { label: 'C', processorFn: 'applyFrequency', params: { type: 'directional', angle: 45, width: 5 },    description: '方向性フィルタ 45°' },
      { label: 'D', processorFn: 'applyFrequency', params: { type: 'lowpass',     sigma: 95 },              description: 'ローパス σ=95（弱いぼかし）' },
    ],
    answer: 0,
    explanation: 'ローパスフィルタは中心付近（低周波）だけを残すため、細かい変化（高周波）が失われ画像全体がぼけます。ハイパスは輪郭、方向性フィルタは特定方向の流れ、通過範囲を広げると元画像に近づきます。',
  },
  {
    id: 'fq-02',
    category: CATEGORY,
    question: '画像にガウシアン型ハイパスフィルタ（σ=14, gain=1.4）を適用した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyFrequency', params: { type: 'highpass',    sigma: 14, gain: 1.4 },   description: 'ハイパス（輪郭抽出）' },
      { label: 'B', processorFn: 'applyFrequency', params: { type: 'lowpass',     sigma: 16 },              description: 'ローパス（ぼかし）' },
      { label: 'C', processorFn: 'applyFrequency', params: { type: 'directional', angle: 45, width: 5 },    description: '方向性フィルタ 45°' },
      { label: 'D', processorFn: 'applyFrequency', params: { type: 'bandpass',    center: 38, sigma: 10, gain: 1.6 }, description: 'バンドパス' },
    ],
    answer: 0,
    explanation: 'ハイパスフィルタは中心（低周波・平坦な部分）を除き高周波だけを残すため、輪郭（エッジ）が灰色背景に浮かび上がります。ローパスはぼかし、バンドパスは中間周波数を残します。',
  },
  {
    id: 'fq-03',
    category: CATEGORY,
    question: '画像に45°の方向性フィルタ（周波数領域、width=5）を適用した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyFrequency', params: { type: 'directional', angle: 45,  width: 5 }, description: '方向性 45°' },
      { label: 'B', processorFn: 'applyFrequency', params: { type: 'directional', angle: 0,   width: 5 }, description: '方向性 0°（水平）' },
      { label: 'C', processorFn: 'applyFrequency', params: { type: 'directional', angle: 90,  width: 5 }, description: '方向性 90°（垂直）' },
      { label: 'D', processorFn: 'applyFrequency', params: { type: 'directional', angle: 135, width: 5 }, description: '方向性 135°' },
    ],
    answer: 0,
    explanation: '原点を通る直線状フィルタは、その向きの周波数成分だけを残します。結果として線と直交する方向に画像がぼけて流れ、フィルタの向きが変わると流れる方向も変わります。',
  },
  {
    id: 'fq-04',
    category: CATEGORY,
    question: '画像にリング状バンドパスフィルタ（center=38, σ=10, gain=1.6）を適用した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyFrequency', params: { type: 'bandpass', center: 38, sigma: 10, gain: 1.6 }, description: 'バンドパス（中間周波数）' },
      { label: 'B', processorFn: 'applyFrequency', params: { type: 'lowpass',  sigma: 16 },                        description: 'ローパス（ぼかし）' },
      { label: 'C', processorFn: 'applyFrequency', params: { type: 'highpass', sigma: 14, gain: 1.4 },             description: 'ハイパス（輪郭）' },
      { label: 'D', processorFn: 'applyFrequency', params: { type: 'directional', angle: 45, width: 5 },           description: '方向性フィルタ 45°' },
    ],
    answer: 0,
    explanation: 'バンドパス（リング状）フィルタは中間の周波数だけを残すため、特定の細かさの模様・輪郭が強調されます。ローパスはぼかし、ハイパスは細い輪郭、方向性は特定方向のみを残します。',
  },
]

export default frequencyQuizzes
