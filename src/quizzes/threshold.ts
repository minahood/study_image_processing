import type { Quiz } from './toneCurve'

const CATEGORY = '二値化・形態学処理'

const thresholdQuizzes: Quiz[] = [
  {
    id: 't-01',
    category: CATEGORY,
    question: '大津の二値化（Otsu法）の特徴として正しいのはどれですか？',
    processorFn: 'applyThreshold',
    params: { method: 'otsu' },
    choices: [
      '常に固定値128を閾値として使う',
      '画像を平滑化してノイズを除去する',
      'クラス間分散が最大になる閾値を自動的に決めて二値化する',
      '輪郭（エッジ）を抽出する',
    ],
    answer: 2,
    explanation:
      '大津法は、白黒2クラスに分けたときのクラス間分散が最大になる閾値を全探索で自動的に求めます。画像ごとに最適な閾値が決まるのが特徴です。',
  },
  {
    id: 't-02',
    category: CATEGORY,
    question: '固定閾値128で二値化すると、各ピクセルはどう変換されますか？',
    processorFn: 'applyThreshold',
    params: { method: 'fixed', value: 128 },
    choices: [
      '輝度が128より大きい画素を白、それ以外を黒にする',
      '画像から自動で最適な閾値を計算して二値化する',
      'すべての色を反転する',
      '輪郭だけを残して塗りつぶす',
    ],
    answer: 0,
    explanation:
      '固定閾値法は、あらかじめ決めた閾値（ここでは128）と各画素の輝度を比較し、閾値より大きければ白、以下なら黒に変換します。明るさが安定した画像で有効です。',
  },
  {
    id: 't-03',
    category: CATEGORY,
    question: '二値画像に膨張（dilate）処理を適用すると、どうなりますか？',
    processorFn: 'morphology',
    params: { operation: 'dilate', kernelSize: 3 },
    choices: [
      '白い領域が縮小し、細い線が消える',
      '白い領域が外側に広がり、小さな穴や隙間が埋まる',
      '画像がぼやける',
      '閾値が自動的に再計算される',
    ],
    answer: 1,
    explanation:
      '膨張は構造要素の範囲内に1つでも白画素があれば中心を白にする処理です。白い領域が外側に膨らみ、小さな黒い穴や途切れが埋まります。逆に収縮（erode）は白領域を縮めます。',
  },
]

export default thresholdQuizzes
