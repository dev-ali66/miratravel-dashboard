export interface FaqItem {
  id: string
  order: number
  question: string
  answer: string
  isOpenByDefault: boolean
}

export interface FaqBackgroundImage {
  id: string
  url: string
  alt: string
  position: string
}

export interface FaqContent {
  title: string
  eyebrow: string
  subtitle: string
  description: string
}

export interface FaqStyles {
  page: {
    backgroundColor: string
    textColor: string
  }

  header: {
    backgroundColor: string
    eyebrowColor: string
    titleColor: string
    subtitleColor: string
    descriptionColor: string
  }

  faq: {
    itemBackgroundColor: string
    itemBorderColor: string
    questionColor: string
    answerColor: string
    iconColor: string
    openBackgroundColor: string
    openQuestionColor: string
    openAnswerColor: string
  }
}

export interface FaqPageData {
  id?: string
  name: string

  metadata: {
    title: string
    description: string
  }

  data: {
    title: string
    description: string

    items: FaqItem[]

    order: number

    bgColor: string

    bgImages: FaqBackgroundImage[]
    bgVideos: unknown[]
    buttons: unknown[]

    content: FaqContent

    styles?: FaqStyles
  }

  deletedAt?: string | null
  createdAt?: string
  updatedAt?: string
}