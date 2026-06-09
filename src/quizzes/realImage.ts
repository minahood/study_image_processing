import type { Quiz } from './types'
import { KERNELS } from '../processors'

export const realImageQuizzes: Quiz[] = [
  // rq-01: momiji R channel inversion
  {
    id: 'rq-01',
    category: 'トーンカーブ',
    question: '紅葉（momiji）画像のRチャンネルのみを反転すると、赤みが消えてどうなる？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'r', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: 'R反転' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'g', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: 'G反転' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'b', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: 'B反転' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: '全チャンネル反転' },
    ],
    answer: 0,
    explanation: 'Rチャンネルを反転すると赤→シアン色に変化し、紅葉の赤みが消えてシアン・青みがかった色調になります。G反転では緑が補色のマゼンタに、B反転では青が黄に変化します。',
  },
  // rq-02: momiji gamma 0.5
  {
    id: 'rq-02',
    category: 'トーンカーブ',
    question: '紅葉画像にγ=0.5のガンマ補正（明るくなる）を適用するとどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:16},{in:128,out:74},{in:255,out:255}] }, description: 'γ=2.0（暗く）' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:101},{in:128,out:181},{in:255,out:255}] }, description: 'γ=0.5（明るく）' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:0},{in:64,out:161},{in:128,out:215},{in:255,out:255}] }, description: 'γ=0.25（非常に明るく）' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: '線形反転' },
    ],
    answer: 1,
    explanation: 'γ=0.5のガンマ補正は中間調を明るくする変換です。γ<1で明るく、γ>1で暗くなります。γ=0.25はさらに明るく、γ=2.0は逆に暗くなります。',
  },
  // rq-03: momiji G channel +80
  {
    id: 'rq-03',
    category: 'トーンカーブ',
    question: '紅葉画像のGチャンネルに+80を加算して緑みがかった色調にしたのはどれ？',
    sourceImage: 'momiji',
    choices: [
      { label: 'A', processorFn: 'applyToneCurve', params: { channel: 'r', curvePoints: [{in:0,out:80},{in:175,out:255},{in:255,out:255}] }, description: 'R+80' },
      { label: 'B', processorFn: 'applyToneCurve', params: { channel: 'b', curvePoints: [{in:0,out:80},{in:175,out:255},{in:255,out:255}] }, description: 'B+80' },
      { label: 'C', processorFn: 'applyToneCurve', params: { channel: 'g', curvePoints: [{in:0,out:80},{in:175,out:255},{in:255,out:255}] }, description: 'G+80' },
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'g', curvePoints: [{in:0,out:0},{in:80,out:0},{in:255,out:175}] }, description: 'G-80' },
    ],
    answer: 2,
    explanation: 'Gチャンネルに+80を加算するとすべての画素の緑成分が底上げされ、全体が緑みがかった色調になります。R+80なら赤みが増し、B+80なら青みが増します。',
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
      { label: 'D', processorFn: 'applyToneCurve', params: { channel: 'rgb', curvePoints: [{in:0,out:255},{in:255,out:0}] }, description: '線形反転' },
    ],
    answer: 0,
    explanation: 'S字カーブは暗部をより暗く、明部をより明るくしてコントラストを強調します。逆S字カーブではコントラストが低下してフラットな印象になります。',
  },
  // rq-05: bud gaussian
  {
    id: 'rq-05',
    category: 'カーネルフィルタ',
    question: '芽（bud）画像にガウシアンフィルタ(3×3)で平滑化を適用したのはどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン平滑化' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, description: '鮮鋭化' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, description: 'ソーベルX' },
    ],
    answer: 0,
    explanation: 'ガウシアンフィルタは周辺画素を重み付き平均して滑らかにします。エッジがぼけて柔らかい印象になります。鮮鋭化はエッジが強調され、ラプラシアン・ソーベルはエッジのみが残ります。',
  },
  {
    id: 'rq-06',
    category: 'カーネルフィルタ',
    question: '芽画像にシャープネスフィルタ（鮮鋭化）を適用したのはどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン平滑化' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sharpen }, description: '鮮鋭化' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.boxBlur3 }, description: 'ボックスブラー' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
    ],
    answer: 1,
    explanation: '鮮鋭化フィルタ（シャープン）は中心画素を強調し周辺との差を大きくします。エッジが際立って見えます。平滑化フィルタとは逆の効果です。',
  },
  {
    id: 'rq-07',
    category: 'カーネルフィルタ',
    question: '芽画像にラプラシアンフィルタ（エッジ強調）を適用したのはどれ？',
    sourceImage: 'bud',
    choices: [
      { label: 'A', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelX }, description: 'ソーベルX' },
      { label: 'B', processorFn: 'applyKernel', params: { kernel: KERNELS.sobelY }, description: 'ソーベルY' },
      { label: 'C', processorFn: 'applyKernel', params: { kernel: KERNELS.laplacian }, description: 'ラプラシアン' },
      { label: 'D', processorFn: 'applyKernel', params: { kernel: KERNELS.gaussian3 }, description: 'ガウシアン' },
    ],
    answer: 2,
    explanation: 'ラプラシアンフィルタは全方向のエッジを検出します。カーネルの和が0なので結果に128を加算してグレー背景にエッジが現れます。ソーベルは特定方向のエッジ、ガウシアンは平滑化です。',
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
    explanation: 'ソーベルXは水平方向の輝度変化（垂直エッジ）を検出します。縦のラインが強調されます。ソーベルYは垂直方向の変化（水平エッジ）を検出し、横のラインが強調されます。',
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
    explanation: '大津の二値化はヒストグラムを解析してクラス間分散が最大になる閾値を自動決定します。固定閾値より安定した結果が得られます。閾値100は暗い領域も含まれ、200は明るい部分のみが前景になります。',
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
    explanation: '固定閾値128は中間輝度を境界にします。閾値64では多くの領域が前景（白）になり、192では少ない領域のみが前景になります。',
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
    explanation: '膨張（dilate）は白領域を拡大させます。3×3カーネルによる膨張後は白い部分が一回り大きくなります。収縮は逆に縮小し、5×5膨張はさらに大きく拡大します。',
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
    explanation: '収縮（erode）は白領域を縮小させ、細い白い線や小さな白い領域が消えます。膨張とは逆の効果で、3×3より5×5の方がより多く収縮します。',
  },
]

export default realImageQuizzes
