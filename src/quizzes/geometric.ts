import type { Quiz } from './types'

const CATEGORY = '幾何学変換'

// 座標変換式の問題文テンプレート
const COORD_Q1 = `図形Aに変換 x' = (1/2)x + 50, y' = (1/2)y + 50 を適用した結果はどれか？

（x方向・y方向ともに 1/2 倍に縮小したうえで、右・下に 50px 平行移動）`

const COORD_Q2 = `図形Aに変換 x' = 2x, y' = 2y を適用した結果はどれか？

（原点を基準にx方向・y方向ともに 2 倍拡大）`

const COORD_Q3 = `図形Aに変換 x' = x + 60, y' = (1/2)y を適用した結果はどれか？

（x方向に +60px 平行移動し、y方向のみ 1/2 倍縮小）`

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
    sourceImage: 'shapes',
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
      '水平反転は各行の画素を左右逆順に並べ替え、鏡に映したような左右反転になります。垂直反転（A）は上下が逆になるため左右関係は保たれ、見分けがつきます。90度回転（C）は縦横が入れ替わり絵柄が横倒しに、180度回転（D）は上下左右がともに反転（点対称）するため、左右だけが入れ替わる水平反転とは異なります。各変換が画素をどう並べ替えるかの理解が問われます。',
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
      '0.5倍縮小では絵柄が元の半分のサイズになります。左上原点で縮小するため絵柄は左上に収まり、残りの領域はサンプリング元がないため黒で埋められます。2倍拡大（B）は逆に絵柄が引き伸ばされて右下がはみ出します。左上への平行移動（C）は絵柄の大きさを変えずに位置だけずらすため縮小とは異なり、x方向のみ0.5倍（D）は横だけ縮んで縦長に潰れる点で、縦横とも縮む等方縮小と区別できます。',
  },
  {
    id: 'g-06',
    category: CATEGORY,
    question: COORD_Q1,
    sourceImage: 'shapes',
    choices: [
      {
        label: 'A',
        processorFn: 'scaleTranslate',
        params: { sx: 0.5, sy: 0.5, tx: 50, ty: 50 },
        description: '1/2倍縮小 + 右下に50px移動',
      },
      {
        label: 'B',
        processorFn: 'scale',
        params: { sx: 0.5, sy: 0.5 },
        description: '1/2倍縮小のみ（移動なし）',
      },
      {
        label: 'C',
        processorFn: 'scaleTranslate',
        params: { sx: 2, sy: 2, tx: 50, ty: 50 },
        description: '2倍拡大 + 右下に50px移動',
      },
      {
        label: 'D',
        processorFn: 'translate',
        params: { dx: 50, dy: 50 },
        description: '右下に50px移動のみ（縮小なし）',
      },
    ],
    answer: 0,
    explanation:
      'x\' = (1/2)x + 50, y\' = (1/2)y + 50 は「1/2倍縮小してから右下に50pxずらす」複合変換です。縮小だけ（B）では絵柄が左上に小さく収まり移動しません。2倍拡大+移動（C）は絵柄が引き伸ばされて大きくなり正反対です。平行移動のみ（D）は絵柄の大きさが変わらないため、小さくなった絵柄が右下に寄るAとは見た目が異なります。',
  },
  {
    id: 'g-07',
    category: CATEGORY,
    question: COORD_Q2,
    sourceImage: 'shapes',
    choices: [
      {
        label: 'A',
        processorFn: 'scale',
        params: { sx: 0.5, sy: 0.5 },
        description: '1/2倍縮小',
      },
      {
        label: 'B',
        processorFn: 'scale',
        params: { sx: 2, sy: 1 },
        description: 'x方向のみ2倍拡大',
      },
      {
        label: 'C',
        processorFn: 'scale',
        params: { sx: 2, sy: 2 },
        description: '縦横2倍拡大',
      },
      {
        label: 'D',
        processorFn: 'scaleTranslate',
        params: { sx: 2, sy: 2, tx: 50, ty: 50 },
        description: '2倍拡大 + 右下に50px移動',
      },
    ],
    answer: 2,
    explanation:
      'x\' = 2x, y\' = 2y は原点基準の等方2倍拡大です。左上原点で拡大するため絵柄は引き伸ばされ、右端・下端がはみ出します。1/2倍縮小（A）は逆に絵柄が小さくなり正反対、x方向のみ2倍（B）は縦は変わらず横だけ伸びます。移動を伴うD（絵柄が右下にずれる）と、移動なしで中身だけ拡大するCは区別できます。',
  },
  {
    id: 'g-08',
    category: CATEGORY,
    question: COORD_Q3,
    sourceImage: 'shapes',
    choices: [
      {
        label: 'A',
        processorFn: 'scaleTranslate',
        params: { sx: 1, sy: 0.5, tx: 60, ty: 0 },
        description: 'x方向+60px移動 + y方向1/2倍縮小',
      },
      {
        label: 'B',
        processorFn: 'translate',
        params: { dx: 60, dy: 0 },
        description: 'x方向+60px移動のみ',
      },
      {
        label: 'C',
        processorFn: 'scale',
        params: { sx: 1, sy: 0.5 },
        description: 'y方向1/2倍縮小のみ',
      },
      {
        label: 'D',
        processorFn: 'scaleTranslate',
        params: { sx: 0.5, sy: 1, tx: 60, ty: 0 },
        description: 'x方向1/2倍縮小 + x方向+60px移動',
      },
    ],
    answer: 0,
    explanation:
      'x\' = x + 60, y\' = (1/2)y は「x方向に+60pxずらし、y方向だけ1/2倍に縮小する」変換です。x方向移動のみ（B）では縦の高さは変わらないため、絵柄が縦に潰れるAと区別できます。y方向縮小のみ（C）は絵柄が右にずれないため移動が見えません。D（x縮小+x移動）はx方向が細くなって移動するため、y方向が潰れて横にずれるAとは縦横の変化が逆になります。',
  },
]

export default geometricQuizzes
