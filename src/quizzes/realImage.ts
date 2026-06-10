import type { Quiz } from './types'
import { KERNELS } from '../processors'

export const realImageQuizzes: Quiz[] = [
  // rq-01: momiji R channel inversion
  {
    id: 'rq-01',
    category: 'トーンカーブ',
    question: '紅葉（momiji）画像のRチャンネルのみを反転（入力0→出力255、入力255→出力0）した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'r', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: 'R反転' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'g', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: 'G反転' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'b', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: 'B反転' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: '全チャンネル反転' },
    ],
    answer: 0,
    explanation: 'Rチャンネルを反転すると、赤が強い紅葉の領域は赤成分が小さくなり補色のシアン（青緑）寄りに変化します。最も赤みの強い画像なのでR反転の効果が顕著です。G反転（B）は緑成分が反転して赤紫（マゼンタ）寄りになり、B反転（C）は青成分が反転して暖色がより黄色く転びます。全チャンネル反転（D）は色相が保たれたまま明暗だけが逆転したネガ画像になり、色味の傾きが出ない点で区別できます。',
  },
  // rq-02: momiji gamma 0.5
  {
    id: 'rq-02',
    category: 'トーンカーブ',
    question: '紅葉画像にγ=0.5のガンマ補正（curvePoints: 0→0, 64→101, 128→181, 255→255）を適用した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:16},{in:128,out:74},{in:255,out:255}] }, description: 'γ=2.0（暗く）' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:101},{in:128,out:181},{in:255,out:255}] }, description: 'γ=0.5（明るく）' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:128},{in:255,out:128}] }, description: '一様グレー化' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: '線形反転' },
    ],
    answer: 1,
    explanation: 'γ=0.5（γ<1）は中間調を持ち上げて全体を明るくしつつ、純黒・純白は保持します。中間点128が181に上がっている点が手がかりです。γ=2.0（A）は逆カーブで中間調が沈んで暗くなり、明暗の傾きが逆なので区別できます。一様グレー化（C）は入力によらず全画素が128になり階調が完全に失われた均一なグレー、線形反転（D）は明暗が逆転したネガ画像になり、いずれも「明るくなる」γ=0.5とは別物です。',
  },
  // rq-03: momiji G channel +80
  {
    id: 'rq-03',
    category: 'トーンカーブ',
    question: '紅葉画像のGチャンネルのみに+80加算（curvePoints: 0→80, 175→255, 255→255）した結果はどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'r', curvePoints: [{in:0,out:80},{in:175,out:255},{in:255,out:255}] }, description: 'R+80' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'b', curvePoints: [{in:0,out:80},{in:175,out:255},{in:255,out:255}] }, description: 'B+80' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'g', curvePoints: [{in:0,out:80},{in:175,out:255},{in:255,out:255}] }, description: 'G+80' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'g', curvePoints: [{in:0,out:0},{in:80,out:0},{in:255,out:175}] }, description: 'G-80' },
    ],
    answer: 2,
    explanation: 'Gチャンネルだけを底上げすると緑成分が増え、全体が黄緑～緑寄りに転びます。R+80（A）は赤がさらに増して紅葉が濃い赤橙に、B+80（B）は青が乗って紫がかった寒色寄りになるため、色の転び方で見分けられます。G−80（D）は逆に緑を引き下げるので赤紫（マゼンタ）寄りになり、緑が増すCとは正反対の色調になります。',
  },
  // rq-04: momiji S-curve contrast
  {
    id: 'rq-04',
    category: 'トーンカーブ',
    question: '紅葉画像にS字カーブでコントラスト強調を適用したのはどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:20},{in:128,out:128},{in:192,out:235},{in:255,out:255}] }, description: 'Sカーブ（コントラスト強調）' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:100},{in:128,out:128},{in:192,out:155},{in:255,out:255}] }, description: '逆Sカーブ（コントラスト低下）' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:101},{in:128,out:181},{in:255,out:255}] }, description: 'γ=0.5（明るく）' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:16},{in:128,out:74},{in:255,out:255}] }, description: 'γ=2.0（暗く）' },
    ],
    answer: 0,
    explanation: 'S字カーブは中間点128を保ったまま暗部（64→20）を沈め明部（192→235）を持ち上げるため、暗い影と明るいハイライトの差が開いてコントラストが強調されます。逆S字（B）は暗部を持ち上げ明部を下げるので中間調に寄ってメリハリの無い眠い画になります。γ=0.5（C）はカーブ全体が上に膨らみ全体が明るく、γ=2.0（D）は全体が暗くなるだけで、両端を残して中央を境に明暗を引き離すS字とは形が異なります。',
  },
  // rq-05: bud gaussian
  {
    id: 'rq-05',
    category: 'カーネルフィルタ',
    question: '芽（bud）画像にガウシアンフィルタ(3×3, 中心4・上下左右2・斜め1, ×1/16)を適用した結果はどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン平滑化' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, description: '鮮鋭化' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, description: 'ソーベルX' },
    ],
    answer: 0,
    explanation: 'ガウシアンは重み付き平均なので画像全体がなめらかにぼけ、輪郭が柔らかくなります。鮮鋭化（B）は逆に輪郭が際立ってザラつき、平滑化とは正反対です。ラプラシアン（C）は重み合計0でグレー背景にエッジ線だけが浮かぶ別物、ソーベルX（D）は縦の輪郭だけがグレー地に現れるため、元の色や形が残ってぼけるガウシアンと一目で区別できます。',
  },
  {
    id: 'rq-06',
    category: 'カーネルフィルタ',
    question: '芽画像に鮮鋭化フィルタ（中心5・上下左右−1・斜め0）を適用した結果はどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン平滑化' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, description: '鮮鋭化' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 }, description: 'ボックスブラー' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
    ],
    answer: 1,
    explanation: '鮮鋭化は中心の重み(5)から周辺(−1)を引くことで、元画像にエッジ成分を足し戻したように輪郭をくっきりさせます。重み合計が1なので明るさは保たれます。ガウシアン（A）と移動平均（C）はどちらも逆にぼけてしまい鮮鋭化と正反対。ラプラシアン（D）は重み合計0でグレー地にエッジ線だけが残り元画像が消えるため、元の芽の絵柄が残ったまま輪郭が立つ鮮鋭化とは区別できます。',
  },
  {
    id: 'rq-07',
    category: 'カーネルフィルタ',
    question: '芽画像にラプラシアンフィルタ（中心−4・上下左右1・斜め0, 重み合計0）を適用した結果はどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, description: 'ソーベルX' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelY }, description: 'ソーベルY' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン' },
    ],
    answer: 2,
    explanation: 'ラプラシアンは重み合計0の2次微分フィルタで、平坦部はグレー(128)、全方向のエッジだけが明暗の線として浮かびます。ソーベルX（A）は縦のエッジ、ソーベルY（B）は横のエッジしか出ず方向に偏りがある点で全方向均等のラプラシアンと異なります。ガウシアン（D）はエッジ抽出ではなく元画像をぼかすだけで、グレー背景に線が出るラプラシアンとは正反対の見た目です。',
  },
  {
    id: 'rq-08',
    category: 'カーネルフィルタ',
    question: '芽画像にソーベルXフィルタ（垂直エッジ検出）を適用したのはどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, description: 'ソーベルX（垂直エッジ）' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelY }, description: 'ソーベルY（水平エッジ）' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン' },
    ],
    answer: 0,
    explanation: 'ソーベルXは左右の輝度差を取る1次微分で、縦方向（垂直）のエッジが強調され横の輪郭はほとんど出ません。ソーベルY（B）は逆に上下の差を取るため横方向のエッジだけが出て、向きが直交する点で見分けられます。ラプラシアン（C）は全方向のエッジが同時に出て方向の偏りがなく、ガウシアン（D）はエッジを出さずぼかすだけなので、縦線だけがグレー地に立つソーベルXと区別できます。',
  },
  // rq-09 to rq-12: summer threshold
  {
    id: 'rq-09',
    category: '二値化・形態学',
    question: 'サマービーチ（summer）画像に大津の二値化を適用したのはどれ？',
    sourceImage: 'summer',
    choices: [
      { label: 'A', processorFn: 'applyThreshold', params: { method: 'fixed', value: 100 }, description: '固定閾値100' },
      { label: 'B', processorFn: 'applyThreshold', params: { method: 'fixed', value: 200 }, description: '固定閾値200' },
      { label: 'C', processorFn: 'applyThreshold', params: { method: 'fixed', value: 150 }, description: '固定閾値150' },
      { label: 'D', processorFn: 'applyThreshold', params: { method: 'otsu' }, description: '大津の二値化' },
    ],
    answer: 3,
    explanation: '大津法はヒストグラムを解析しクラス間分散が最大になる閾値を自動決定するため、空・海・砂が前景／背景にバランスよく分かれます。固定閾値100（A）は閾値が低く広い範囲が白（前景）になり、固定閾値200（B）は閾値が高くごく明るい空などしか白にならず大半が黒、固定閾値150（C）はその中間になります。3つの固定値はいずれも画像に依らず一定の閾値で切るため、画像の輝度分布に最適化される大津法の結果とは前景の取り方が異なります。',
  },
  {
    id: 'rq-10',
    category: '二値化・形態学',
    question: 'サマービーチ画像に固定閾値128で二値化したのはどれ？',
    sourceImage: 'summer',
    choices: [
      { label: 'A', processorFn: 'applyThreshold', params: { method: 'fixed', value: 64 }, description: '固定閾値64' },
      { label: 'B', processorFn: 'applyThreshold', params: { method: 'fixed', value: 128 }, description: '固定閾値128' },
      { label: 'C', processorFn: 'applyThreshold', params: { method: 'fixed', value: 192 }, description: '固定閾値192' },
      { label: 'D', processorFn: 'applyThreshold', params: { method: 'otsu' }, description: '大津の二値化' },
    ],
    answer: 1,
    explanation: '固定閾値128は中間輝度を境界にし、輝度128超を白・以下を黒にします。閾値64（A）は境界が低いため暗めの領域まで白になり白領域が広く、閾値192（C）は境界が高いため明るい部分しか白にならず白領域が狭くなります。大津法（D）は画像の分布に応じて閾値が動くため、128固定とは前景の取り方がずれます。閾値の大小と白領域の広さの対応を理解しているかが問われます。',
  },
  {
    id: 'rq-11',
    category: '二値化・形態学',
    question: 'サマービーチ画像を大津法で二値化後、3×3カーネルで膨張（dilate）したのはどれ？',
    sourceImage: 'summer',
    choices: [
      { label: 'A', processorFn: 'applyThreshold', params: { method: 'otsu' }, description: '大津の二値化のみ' },
      { label: 'B', processorFn: 'morphology', params: { operation: 'dilate', kernelSize: 3 }, description: '大津+膨張3×3' },
      { label: 'C', processorFn: 'morphology', params: { operation: 'erode', kernelSize: 3 }, description: '大津+収縮3×3' },
      { label: 'D', processorFn: 'morphology', params: { operation: 'dilate', kernelSize: 5 }, description: '大津+膨張5×5' },
    ],
    answer: 1,
    explanation: '膨張（dilate）は構造要素内に白画素が1つでもあれば中心を白にする処理で、3×3カーネルでは白領域が一回り太ります。二値化のみ（A）は白領域が広がらず元のまま、収縮（C）は逆に白領域が痩せて細い部分が消えるため膨張とは正反対です。5×5膨張（D）は同じ膨張でも広がり方がより大きく輪郭が太く丸まる点で3×3と区別でき、処理の向きとカーネルサイズの効き方の理解が問われます。',
  },
  {
    id: 'rq-12',
    category: '二値化・形態学',
    question: 'サマービーチ画像を大津法で二値化後、3×3カーネルで収縮（erode）したのはどれ？',
    sourceImage: 'summer',
    choices: [
      { label: 'A', processorFn: 'applyThreshold', params: { method: 'otsu' }, description: '大津の二値化のみ' },
      { label: 'B', processorFn: 'morphology', params: { operation: 'dilate', kernelSize: 3 }, description: '大津+膨張3×3' },
      { label: 'C', processorFn: 'morphology', params: { operation: 'erode', kernelSize: 3 }, description: '大津+収縮3×3' },
      { label: 'D', processorFn: 'morphology', params: { operation: 'erode', kernelSize: 5 }, description: '大津+収縮5×5' },
    ],
    answer: 2,
    explanation: '収縮（erode）は構造要素内がすべて白のときだけ中心を白にする処理で、白領域が痩せ細い線や小さな白点が消えます。二値化のみ（A）は白領域がそのまま、膨張（B）は逆に白領域が太るため収縮とは正反対の見た目です。5×5収縮（D）は同じ収縮でも削れ方がより大きく細部が消えやすい点で3×3と区別でき、処理の向きとカーネルサイズの効き方の理解が問われます。',
  },
]

export default realImageQuizzes
