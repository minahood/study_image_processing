import type { Quiz } from './toneCurve'

const CATEGORY = '幾何学変換'

const geometricQuizzes: Quiz[] = [
  {
    id: 'g-01',
    category: CATEGORY,
    question: '画像を右方向に 50px 平行移動（translate）すると、どうなりますか？',
    processorFn: 'translate',
    params: { dx: 50, dy: 0 },
    sourceImage: 'checker',
    choices: [
      '絵柄が右へずれ、左端に黒い帯ができる',
      '絵柄が左へずれ、右端に黒い帯ができる',
      '画像全体が右に回転する',
      '画像が横方向に引き伸ばされる',
    ],
    answer: 0,
    explanation:
      '平行移動は絵柄全体を指定方向にずらす変換です。右に50pxずらすと、左端には元画像になかった領域が現れ、黒（はみ出し領域）で埋められます。',
  },
  {
    id: 'g-02',
    category: CATEGORY,
    question: 'x方向にのみ 2倍 拡大（scale, sx=2, sy=1）すると、どうなりますか？',
    processorFn: 'scale',
    params: { sx: 2, sy: 1 },
    sourceImage: 'geometric',
    choices: [
      '画像が縦に引き伸ばされる',
      '画像全体が2倍の面積になる',
      '横方向に引き伸ばされ、右半分は画面外へはみ出す',
      '画像が縮小される',
    ],
    answer: 2,
    explanation:
      'x方向だけ2倍に拡大すると絵柄が横に引き伸ばされます。出力サイズは変わらないため、拡大されて右側にはみ出した部分は表示されません。',
  },
  {
    id: 'g-03',
    category: CATEGORY,
    question: '画像を中心まわりに 90度 回転（rotate）すると、どうなりますか？',
    processorFn: 'rotate',
    params: { angleDeg: 90 },
    sourceImage: 'geometric',
    choices: [
      '画像が左右反転する',
      '絵柄が中心を軸に90度回転する',
      '画像が上下に引き伸ばされる',
      '何も変化しない',
    ],
    answer: 1,
    explanation:
      '回転変換は指定した中心（デフォルトは画像中央）のまわりに絵柄を回します。90度回転では縦横の関係が入れ替わったように見えます。正方形画像なので隅が欠けることはありません。',
  },
  {
    id: 'g-04',
    category: CATEGORY,
    question: '画像を水平反転（flipHorizontal）すると、どうなりますか？',
    processorFn: 'flipHorizontal',
    params: {},
    sourceImage: 'checker',
    choices: [
      '上下が反転する',
      '色が反転する（ネガ）',
      '左右が鏡像のように反転する',
      '画像が90度回転する',
    ],
    answer: 2,
    explanation:
      '水平反転は各行の画素を左右逆順に並べ替える処理です。鏡に映したような左右反転になります（上下反転＝flipVertical とは別の処理）。',
  },
  {
    id: 'g-05',
    category: CATEGORY,
    question: '画像を 0.5倍 に縮小（scale, sx=0.5, sy=0.5）すると、どうなりますか？',
    processorFn: 'scale',
    params: { sx: 0.5, sy: 0.5 },
    sourceImage: 'geometric',
    choices: [
      '絵柄が左上 1/4 に縮小され、残りは黒で埋まる',
      '画像全体が2倍に拡大される',
      '画像が時計回りに回転する',
      '画像の色が薄くなる',
    ],
    answer: 0,
    explanation:
      '0.5倍縮小では絵柄が元の半分のサイズになります。左上原点で縮小するため絵柄は左上に収まり、それ以外の領域はサンプリング元が無いため黒で埋められます。',
  },
]

export default geometricQuizzes
