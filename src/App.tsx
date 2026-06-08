import { toneCurveQuizzes } from './quizzes'
import SourceImageCanvas from './components/SourceImageCanvas'
import ProcessedImageCanvas from './components/ProcessedImageCanvas'

export default function App() {
  const quiz = toneCurveQuizzes[0]

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      <h1>画像処理クイズサイト</h1>

      <p style={{ marginBottom: '1.5rem' }}>{quiz.question}</p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <figure style={{ margin: 0 }}>
          <figcaption style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>元画像</figcaption>
          <SourceImageCanvas width={200} height={200} />
        </figure>

        <figure style={{ margin: 0 }}>
          <figcaption style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>処理後</figcaption>
          <ProcessedImageCanvas quizId={quiz.id} width={200} height={200} />
        </figure>
      </div>
    </main>
  )
}
