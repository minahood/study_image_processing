import { toneCurveQuizzes } from './quizzes'

export default function App() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      <h1>画像処理クイズサイト</h1>
      <p>動作確認用の最小ページです。トーンカーブのクイズが {toneCurveQuizzes.length} 問読み込まれています。</p>
      <ol>
        {toneCurveQuizzes.map((quiz) => (
          <li key={quiz.id} style={{ marginBottom: '1rem' }}>
            <strong>{quiz.question}</strong>
            <ul>
              {quiz.choices.map((choice, i) => (
                <li key={i}>{choice}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  )
}
