export type QuizChoice = {
  label: string
  processorFn: string
  params: object
  description?: string
  kernelMatrix?: string
}

export type Quiz = {
  id: string
  category: string
  question: string
  sourceImage: string
  choices: QuizChoice[]
  answer: number
  explanation: string
  outputDisplay?: {
    processorFn: string
    params: object
  }
  showAxes?: boolean
}
