import type { Quiz } from './types'

const CATEGORY = '幾何学変換'

const geometricQuizzes: Quiz[] = [
  {
    id: 'g-01',
    category: CATEGORY,
    question: '画像を右方向に 50px 平行移動（translate dx=50）した結果はどれ？',
    sourceImage: 'checker',
    choices: [
      {
        label: 'A',
        processorFn: 'translate',
        params: { dx: 50, dy: 0 },
        description: '右に50px移動',
      },
      {
        label: 'B',
        processorFn: 'translate',
        params: { dx: -50, dy: 0 },
        description: '左に50px移動',
      },
      {
        label: 'C',
        processorFn: 'translate',
        params: { dx: 0, dy: 50 },
        description: '下に50px移動',
      },
      {
        label: 'D',
        processorFn: 'translate',
        params: { dx: 50, dy: 50 },
        description: '右下に50px移動',
      },
    ],
    answer: 0,
    explanation:
      '平行移動は絵柄全体を指定方向にずらす変換です。右に50pxずらすと、左端には元画像になかった領域が現れ、黒で埋められます。左移動では右端が黒、下移動では上端が黒になります。',
  },
  {
    id: 'g-02',
    category: CATEGORY,
    question: 'x方向のみ 2倍 拡大（scale sx=2, sy=1）した結果はどれ？',
    sourceImage: 'shapes',
    choices: [
      {
        label: 'A',
        processorFn: 'scale',
        params: { sx: 1, sy: 2 },
        description: 'y方向のみ2倍',
      },
      {
        label: 'B',
        processorFn: 'scale',
        params: { sx: 2, sy: 2 },
        description: '縦横2倍',
      },
      {
        label: 'C',
        processorFn: 'scale',
        params: { sx: 2, sy: 1 },
        description: 'x方向のみ2倍',
      },
      {
        label: 'D',
        processorFn: 'scale',
        params: { sx: 0.5, sy: 1 },
        description: 'x方向0.5倍',
      },
    ],
    answer: 2,
    explanation:
      'x方向だけ2倍に拡大すると絵柄が横に引き伸ばされます。出力サイズは変わらないため、拡大されて右側にはみ出した部分は表示されません。y方向だけ拡大すると縦伸び、両方2倍だと全体が拡大されて右下がはみ出します。',
  },
  {
    id: 'g-03',
    category: CATEGORY,
    question: '画像を中心まわりに 90度 回転（rotate angleDeg=90）した結果はどれ？',
    sourceImage: 'shapes',
    choices: [
      {
        label: 'A',
        processorFn: 'rotate',
        params: { angleDeg: 45 },
        description: '45度回転',
      },
      {
        label: 'B',
        processorFn: 'flipHorizontal',
        params: {},
        description: '水平反転',
      },
      {
        label: 'C',
        processorFn: 'rotate',
        params: { angleDeg: 180 },
        description: '180度回転',
      },
      {
        label: 'D',
        processorFn: 'rotate',
        params: { angleDeg: 90 },
        description: '90度回転',
      },
    ],
    answer: 3,
    explanation:
      '回転変換は指定した中心（デフォルトは画像中央）のまわりに絵柄を回します。90度回転では縦横の関係が入れ替わったように見えます。45度では斜めに傾き隅が黒になり、180度では上下左右が逆転します。',
  },
  {
    id: 'g-04',
    category: CATEGORY,
    question: '画像を水平反転（flipHorizontal）した結果はどれ？',
    sourceImage: 'checker',
    choices: [
      {
        label: 'A',
        processorFn: 'flipVertical',
        params: {},
        description: '垂直反転',
      },
      {
        label: 'B',
        processorFn: 'flipHorizontal',
        params: {},
        description: '水平反転',
      },
      {
        label: 'C',
        processorFn: 'rotate',
        params: { angleDeg: 90 },
        description: '90度回転',
      },
      {
        label: 'D',
        processorFn: 'rotate',
        params: { angleDeg: 180 },
        description: '180度回転',
      },
    ],
    answer: 1,
    explanation:
      '水平反転は各行の画素を左右逆順に並べ替える処理です。鏡に映したような左右反転になります。垂直反転（flipVertical）は上下が逆になります。チェッカーボードの場合、水平・垂直反転のどちらも見た目が同じになることがあります。',
  },
  {
    id: 'g-05',
    category: CATEGORY,
    question: '画像を 0.5倍 に縮小（scale sx=0.5, sy=0.5）した結果はどれ？',
    sourceImage: 'shapes',
    choices: [
      {
        label: 'A',
        processorFn: 'scale',
        params: { sx: 0.5, sy: 0.5 },
        description: '0.5倍縮小',
      },
      {
        label: 'B',
        processorFn: 'scale',
        params: { sx: 2, sy: 2 },
        description: '2倍拡大',
      },
      {
        label: 'C',
        processorFn: 'translate',
        params: { dx: -50, dy: -50 },
        description: '左上に50px移動',
      },
      {
        label: 'D',
        processorFn: 'scale',
        params: { sx: 0.5, sy: 1 },
        description: 'x方向のみ0.5倍',
      },
    ],
    answer: 0,
    explanation:
      '0.5倍縮小では絵柄が元の半分のサイズになります。左上原点で縮小するため絵柄は左上に収まり、それ以外の領域はサンプリング元がないため黒で埋められます。2倍拡大では逆に絵柄が引き伸ばされてはみ出します。',
  },
]

export default geometricQuizzes
