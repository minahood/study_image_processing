export type QuizChoice = {
  label: string
  processorFn: string
  params: object
  description?: string
}

export type Quiz = {
  id: string
  category: string
  question: string
  sourceImage: string
  choices: QuizChoice[]
  answer: number
  explanation: string
}
