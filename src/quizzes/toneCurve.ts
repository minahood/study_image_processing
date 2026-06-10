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
        params: { channel: 'g', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: 'Gチャンネルのみ反転',
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
        params: { channel: 'b', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: 'Bチャンネルのみ反転',
      },
    ],
    answer: 1,
    explanation:
      '全チャンネルに同じ反転カーブを適用すると、色相は保たれたまま明暗だけが逆転したネガ画像になります。Rのみ反転（C）は赤の強い紅葉がシアン寄りに、Gのみ反転（A）はマゼンタ寄りに、Bのみ反転（D）は黄色寄りに転び、いずれも特定方向に色が偏ります。全チャンネル反転だけが色の偏りなく明暗が反転する点で区別できます。',
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
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 96 }, { in: 255, out: 160 }] },
        description: '低コントラスト化',
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
      '出力値が常に128の水平カーブは入力によらず全画素を128に変換するため、階調が完全に失われ画像全体が一様な中間グレー(#808080)になります。低コントラスト化（A）は出力を96〜160の狭い範囲に圧縮しますが階調は残るためグラデーションが薄く見え、中間調を暗くするカーブ（B）は両端を残し中央だけ沈むため階調が残ります。反転（D）は明暗が逆転したネガで、いずれも階調が残る点で「全画素が同一値になる」均一グレーと区別できます。',
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
    question: '全チャンネルにカーブ（入力0→出力0、入力128→出力200、入力255→出力255）を適用した結果はどれ？',
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
        params: { channel: 'rgb', curvePoints: [{ in: 0, out: 255 }, { in: 255, out: 0 }] },
        description: '反転',
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
      '中間点(128)を200へ引き上げ両端(0・255)を保持するカーブは、純黒・純白を残したまま中間調を明るく持ち上げます。中間調を暗くするカーブ（A）は逆に中央が64へ沈み、グラデーションが暗側に寄ります。反転（C）は明暗が逆転したネガ、均一グレー化（D）は階調が消えて全面が一様な中間グレーになり、いずれも「中間調が明るくなる」本問とは別物です。カーブの中間点を上げる／下げる向きの違いを理解しているかが問われます。',
  },
]

export default toneCurveQuizzes
