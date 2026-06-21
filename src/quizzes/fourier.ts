import type { Quiz } from './types'

const CATEGORY = 'フーリエ変換'

export const fourierQuizzes: Quiz[] = [
  {
    id: 'ft-01',
    category: CATEGORY,
    question: '左の縦縞パターンをフーリエ変換し、振幅スペクトルを中心化（低周波が中央）で表したものはどれ？',
    sourceImage: 'pat_vstripe',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'vstripe' }, description: '縦縞のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'hstripe' }, description: '横縞のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'dstripe' }, description: '45°斜め縞のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'd135' },    description: '135°斜め縞のスペクトル' },
    ],
    answer: 0,
    explanation: '縦縞は「横方向に明暗が変化する」単一周波数の波です。そのため振幅スペクトルは中心の左右に1対の輝点として現れます。縞の向き（縦）とスペクトルの輝点が並ぶ向き（横）は必ず直交します。',
  },
  {
    id: 'ft-02',
    category: CATEGORY,
    question: '左の横縞パターンのフーリエ振幅スペクトル（中心化）はどれ？',
    sourceImage: 'pat_hstripe',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'vstripe' }, description: '縦縞のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'hstripe' }, description: '横縞のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'dstripe' }, description: '45°斜め縞のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'd135' },    description: '135°斜め縞のスペクトル' },
    ],
    answer: 1,
    explanation: '横縞は「縦方向に明暗が変化する」波なので、スペクトルは中心の上下に1対の輝点になります。縦縞（左右の点）とちょうど90°違うことに注目しましょう。',
  },
  {
    id: 'ft-03',
    category: CATEGORY,
    question: '左の45°の斜め縞のフーリエ振幅スペクトル（中心化）はどれ？',
    sourceImage: 'pat_dstripe',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'd135' },    description: '135°斜め縞のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'dstripe' }, description: '45°斜め縞のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'hstripe' }, description: '横縞のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'vstripe' }, description: '縦縞のスペクトル' },
    ],
    answer: 1,
    explanation: '縞が斜め（45°）に傾くと、スペクトルの1対の輝点も同じだけ傾いて対角線上に並びます。縞の傾きとスペクトルの傾きは連動します。',
  },
  {
    id: 'ft-04',
    category: CATEGORY,
    question: '左の市松模様（斜め格子）のフーリエ振幅スペクトルはどれ？',
    sourceImage: 'pat_checker',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'cross' },   description: '格子（縦横）のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'dstripe' }, description: '45°斜め縞のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'checker' }, description: '市松模様のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'd135' },    description: '135°縞のスペクトル' },
    ],
    answer: 2,
    explanation: '市松模様は cos(x)×cos(y) の積で、斜め2方向の波が掛け合わさっています。そのためスペクトルは中心の周りに「×」字状の4つの輝点として現れます。',
  },
  {
    id: 'ft-05',
    category: CATEGORY,
    question: '左の縦横の格子（縦縞＋横縞）のフーリエ振幅スペクトルはどれ？',
    sourceImage: 'pat_cross',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'checker' }, description: '市松模様のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'dstripe' }, description: '45°縞のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'hstripe' }, description: '横縞のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'cross' },   description: '格子のスペクトル' },
    ],
    answer: 3,
    explanation: '縦縞と横縞を足し合わせた格子は、横方向の波と縦方向の波を両方持ちます。スペクトルは中心の上下左右に「＋」字状の4つの輝点になります（市松模様の「×」と区別！）。',
  },
  {
    id: 'ft-06',
    category: CATEGORY,
    question: '左の同心円（一定間隔のリング）のフーリエ振幅スペクトルはどれ？',
    sourceImage: 'pat_concentric',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'concentric' }, description: '同心円のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'hex' },        description: '六角格子のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'pebbles' },    description: '小石のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'fence' },      description: '金網のスペクトル' },
    ],
    answer: 0,
    explanation: '一定間隔の同心円はあらゆる方向に同じ周波数の波を含むため、スペクトルは中心から一定半径の「リング（円環）」状になります。方向に依存しない＝等方的なパターンの特徴です。',
  },
  {
    id: 'ft-07',
    category: CATEGORY,
    question: '左の六角形の周期パターン（実画像）のフーリエ振幅スペクトルはどれ？',
    sourceImage: 'blue_kikagaku',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'metal' },  description: '金属ヘアラインのスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'fence' },  description: '金網のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'shapes' }, description: '図形のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'hex' },    description: '六角格子のスペクトル' },
    ],
    answer: 3,
    explanation: '規則正しく繰り返す六角形パターンは、繰り返し周期に対応した離散的な輝点の集まりになります。六方格子の対称性を反映して、輝点も六角形状（六方配置）に並びます。周期構造ほどスペクトルは点状にはっきり現れます。',
  },
  {
    id: 'ft-08',
    category: CATEGORY,
    question: '左の金属のヘアライン仕上げ（一方向にそろった細い筋）のフーリエ振幅スペクトル（中心化）はどれ？',
    sourceImage: 'metal',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'metal' },  description: '金属ヘアラインのスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'fence' },  description: '金網のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'shapes' }, description: '図形のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'hex' },    description: '六角格子のスペクトル' },
    ],
    answer: 0,
    explanation: 'ヘアライン（ブラシ目）はすべて同じ向きにそろった無数の細い筋です。異方的な模様なのでスペクトルのエネルギーは中心を通る一本の明るい筋（直線状）に集中します。筋の傾きはヘアラインの向きと直交します。',
  },
  {
    id: 'ft-09',
    category: CATEGORY,
    question: '左の金網（菱形の周期メッシュ）のフーリエ振幅スペクトルはどれ？',
    sourceImage: 'fence',
    choices: [
      { label: 'A', processorFn: 'fourier', params: { pattern: 'hex' },   description: '六角格子のスペクトル' },
      { label: 'B', processorFn: 'fourier', params: { pattern: 'fence' }, description: '金網のスペクトル' },
      { label: 'C', processorFn: 'fourier', params: { pattern: 'shapes' },description: '図形のスペクトル' },
      { label: 'D', processorFn: 'fourier', params: { pattern: 'metal' }, description: '金属ヘアラインのスペクトル' },
    ],
    answer: 1,
    explanation: '金網は菱形が規則正しく繰り返す周期パターンなので、スペクトルは網目の2つの斜め方向に沿ってエネルギーが伸び、中心から斜めに広がる「×字状」の構造になります。',
  },
]

export default fourierQuizzes
