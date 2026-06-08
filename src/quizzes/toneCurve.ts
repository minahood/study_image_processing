import type { CurvePoint } from '../processors/toneCurve'

export type Quiz = {
  id: string
  category: string
  question: string
  processorFn: string
  params: object
  choices: string[]
  answer: number
  explanation: string
  /** 出題に使うテスト画像の種類（省略時は 'geometric'） */
  sourceImage?: string
}

const CATEGORY = 'トーンカーブ'

const toneCurveQuizzes: Quiz[] = [
  {
    id: 'tc-01',
    category: CATEGORY,
    question:
      '右の画像にトーンカーブを適用しました。入力 0→出力 255、入力 255→出力 0 の直線カーブを全チャンネルに適用した場合、結果として正しいのはどれですか？',
    processorFn: 'applyToneCurve',
    params: {
      channel: 'rgb',
      curvePoints: [
        { in: 0, out: 255 },
        { in: 255, out: 0 },
      ] satisfies CurvePoint[],
    },
    choices: [
      '明暗が反転した画像になる（ネガポジ反転）',
      '画像が全体的に明るくなる',
      '画像のコントラストが下がり、グレーに近づく',
      '彩度が失われてグレースケールになる',
    ],
    answer: 0,
    explanation:
      '入出力を完全に反転させると輝度の明暗が逆転します。これはネガフィルムのような見た目になるフィルム反転（ネガポジ反転）です。全チャンネルに同じカーブを適用しているため色相は保たれます。',
  },
  {
    id: 'tc-02',
    category: CATEGORY,
    question:
      'Rチャンネルのみに「入力 0→出力 0、入力 255→出力 255」の直線カーブをかけ、G・Bチャンネルは変化させないとどうなりますか？',
    processorFn: 'applyToneCurve',
    params: {
      channel: 'r',
      curvePoints: [
        { in: 0, out: 0 },
        { in: 255, out: 255 },
      ] satisfies CurvePoint[],
    },
    choices: [
      '画像全体が赤みがかった色に変わる',
      '画像はまったく変化しない',
      '赤色が消えて青緑っぽくなる',
      '彩度だけが下がる',
    ],
    answer: 1,
    explanation:
      '入力値と出力値が同じ恒等カーブを適用しているため、Rチャンネルの値は一切変わりません。G・Bも変化しないので画像全体が元のままです。',
  },
  {
    id: 'tc-03',
    category: CATEGORY,
    question:
      '全チャンネルに対して「入力 0→出力 128、入力 255→出力 128」の水平直線カーブを適用すると、出力画像はどうなりますか？',
    processorFn: 'applyToneCurve',
    params: {
      channel: 'rgb',
      curvePoints: [
        { in: 0, out: 128 },
        { in: 255, out: 128 },
      ] satisfies CurvePoint[],
    },
    choices: [
      '画像のコントラストが2倍になる',
      '画像が全体的に半透明になる',
      '全ピクセルが中間グレー（RGB 128,128,128）になる',
      '輝度が128以上のピクセルだけ白になる',
    ],
    answer: 2,
    explanation:
      '出力値が常に128の水平カーブは、入力値によらず全ピクセルを同じ値に変換します。R・G・B すべてが 128 になるため、画像全体が一様な中間グレーになります。',
  },
  {
    id: 'tc-04',
    category: CATEGORY,
    question:
      '全チャンネルに「入力 0→出力 0、入力 128→出力 64、入力 255→出力 255」のS字型（中間を暗くする）カーブを適用すると、どのような効果が得られますか？',
    processorFn: 'applyToneCurve',
    params: {
      channel: 'rgb',
      curvePoints: [
        { in: 0, out: 0 },
        { in: 128, out: 64 },
        { in: 255, out: 255 },
      ] satisfies CurvePoint[],
    },
    choices: [
      '画像全体が均一に明るくなる（露出補正）',
      '画像が反転してネガになる',
      '色相が120°回転してシフトする',
      '中間調が暗くなりコントラストが変化する',
    ],
    answer: 3,
    explanation:
      '中間点（128）を 64 に引き下げることで暗部が広がり、シャドウ域が強調されます。両端（0と255）はそのままなので純黒・純白は変わらず、中間調のみコントラストが変化します。',
  },
  {
    id: 'tc-05',
    category: CATEGORY,
    question:
      'Bチャンネルのみに「入力 0→出力 255、入力 255→出力 0」の反転カーブを適用すると、元々白（255,255,255）だったピクセルは何色になりますか？',
    processorFn: 'applyToneCurve',
    params: {
      channel: 'b',
      curvePoints: [
        { in: 0, out: 255 },
        { in: 255, out: 0 },
      ] satisfies CurvePoint[],
    },
    choices: [
      '赤色（RGB: 255, 0, 0）',
      '黄色（RGB: 255, 255, 0）',
      'シアン（RGB: 0, 255, 255）',
      '黒色（RGB: 0, 0, 0）',
    ],
    answer: 1,
    explanation:
      'R=255・G=255 はそのまま、B=255 が反転して B=0 になります。(255, 255, 0) は加法混色で黄色です。補色の関係で「青を反転させると黄色になる」と覚えられます。',
  },
]

export default toneCurveQuizzes
