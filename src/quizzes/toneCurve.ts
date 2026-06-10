import type { Quiz, QuizChoice } from './types'

export type { Quiz, QuizChoice }

const CATEGORY = 'トーンカーブ'

export const toneCurveQuizzes: Quiz[] = [
  {
    id: 'tc-01',
    category: CATEGORY,
    question: '元画像のRチャンネルのみを全体的に明るくした結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      {
        label: 'A',
        processorFn: 'applyToneCurve',
        params: { channel: 'r', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 180 }, { in: 255, out: 255 }] },
        description: 'Rチャンネル明るく',
      },
      {
        label: 'B',
        processorFn: 'applyToneCurve',
        params: { channel: 'g', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 180 }, { in: 255, out: 255 }] },
        description: 'Gチャンネル明るく',
      },
      {
        label: 'C',
        processorFn: 'applyToneCurve',
        params: { channel: 'b', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 180 }, { in: 255, out: 255 }] },
        description: 'Bチャンネル明るく',
      },
      {
        label: 'D',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 180 }, { in: 255, out: 255 }] },
        description: '全チャンネル明るく',
      },
    ],
    answer: 0,
    explanation:
      'Rチャンネルのみを明るくすると画像全体が赤みがかって見えます。GチャンネルならGreenがかり、Bチャンネルなら青みが増します。全チャンネル（rgb）を同様に上げると赤み・緑み・青みが均等に上がって明度だけが増します。',
  },
  {
    id: 'tc-02',
    category: CATEGORY,
    question: '全チャンネルにネガポジ反転（入力0→出力255、入力255→出力0）を適用した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      {
        label: 'A',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 255, out: 255 }] },
        description: '変化なし（恒等変換）',
      },
      {
        label: 'B',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: '全チャンネル反転',
      },
      {
        label: 'C',
        processorFn: 'applyToneCurve',
        params: { channel: 'r', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: 'Rチャンネルのみ反転',
      },
      {
        label: 'D',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 128 }, { in: 255, out: 128 }] },
        description: '全チャンネルを中間グレーに',
      },
    ],
    answer: 1,
    explanation:
      '入出力を完全に反転させると輝度の明暗が逆転します（ネガポジ反転）。全チャンネルに同じカーブを適用しているため色相は保たれたまま明暗が反転します。Rチャンネルのみ反転だと画像がシアンがかって見えます。',
  },
  {
    id: 'tc-03',
    category: CATEGORY,
    question: '全チャンネルに水平直線カーブ（入力0→出力128、入力255→出力128）を適用した結果はどれ？',
    sourceImage: 'gradient',
    choices: [
      {
        label: 'A',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 255, out: 255 }] },
        description: '変化なし',
      },
      {
        label: 'B',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 64 }, { in: 255, out: 255 }] },
        description: '中間調を暗く',
      },
      {
        label: 'C',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 128 }, { in: 255, out: 128 }] },
        description: '全ピクセル中間グレー',
      },
      {
        label: 'D',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: '反転',
      },
    ],
    answer: 2,
    explanation:
      '出力値が常に128の水平カーブは、入力値によらず全ピクセルを同じ値(128)に変換します。R・G・B すべてが 128 になるため、画像全体が一様な中間グレー(#808080)になります。',
  },
  {
    id: 'tc-04',
    category: CATEGORY,
    question: 'Bチャンネルのみに反転カーブ（入力0→出力255、入力255→出力0）を適用した結果はどれ？',
    sourceImage: 'checker',
    choices: [
      {
        label: 'A',
        processorFn: 'applyToneCurve',
        params: { channel: 'r', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: 'Rチャンネル反転',
      },
      {
        label: 'B',
        processorFn: 'applyToneCurve',
        params: { channel: 'g', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: 'Gチャンネル反転',
      },
      {
        label: 'C',
        processorFn: 'applyToneCurve',
        params: { channel: 'b', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: 'Bチャンネル反転',
      },
      {
        label: 'D',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: '全チャンネル反転',
      },
    ],
    answer: 2,
    explanation:
      'Bチャンネルを反転すると、白(255,255,255)は黄色(255,255,0)に、黒(0,0,0)は青(0,0,255)になります。補色の関係で「青を反転させると黄色」という見た目の変化が現れます。Rを反転するとシアン系、Gを反転するとマゼンタ系の見た目になります。',
  },
  {
    id: 'tc-05',
    category: CATEGORY,
    question: '中間調のみコントラストを上げる（入力0→出力0、入力128→出力200、入力255→出力255）を適用した結果はどれ？',
    sourceImage: 'gradient',
    choices: [
      {
        label: 'A',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 64 }, { in: 255, out: 255 }] },
        description: '中間調を暗く',
      },
      {
        label: 'B',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 128, out: 200 }, { in: 255, out: 255 }] },
        description: '中間調を明るく',
      },
      {
        label: 'C',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 0 }, { in: 255, out: 255 }] },
        description: '変化なし',
      },
      {
        label: 'D',
        processorFn: 'applyToneCurve',
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 128 }, { in: 255, out: 128 }] },
        description: '中間グレーに均一化',
      },
    ],
    answer: 1,
    explanation:
      '中間点(128)を200に引き上げることで、中間調が全体的に明るくなります。両端(0と255)はそのまま保持されるため、純黒・純白は変わらず中間調の明るさが上がります。これはフォトレタッチでよく使われる「明るさ調整」の基本操作です。',
  },
]

export default toneCurveQuizzes
