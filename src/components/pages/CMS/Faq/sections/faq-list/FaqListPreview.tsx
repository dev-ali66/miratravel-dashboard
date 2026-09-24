import { useState } from "react"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { emptyFaqList } from "../../config/emptyFaqPayload"

function PlanningIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M5.92578 11.8541L17.7785 5.92773L29.6311 11.8541L41.4838 5.92773V35.5594L29.6311 41.4858L17.7785 35.5594L5.92578 41.4858V11.8541Z" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.7773 5.92773V35.5594" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29.6328 11.8535V41.4852" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AccommodationIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M3.94922 7.9043V39.5114" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.94922 15.8027H39.5072C40.5551 15.8027 41.56 16.219 42.3009 16.9599C43.0419 17.7009 43.4581 18.7058 43.4581 19.7536V39.5081" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.94922 33.5801H43.4581" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.8516 15.8027V33.5817" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PaymentsIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M41.4855 7.9043H5.92745C3.74544 7.9043 1.97656 9.67317 1.97656 11.8552V35.5605C1.97656 37.7426 3.74544 39.5114 5.92745 39.5114H41.4855C43.6675 39.5114 45.4364 37.7426 45.4364 35.5605V11.8552C45.4364 9.67317 43.6675 7.9043 41.4855 7.9043Z" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.97656 19.7607H45.4364" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BeforeTravelIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M31.606 7.9043H15.8025C13.6204 7.9043 11.8516 9.67317 11.8516 11.8552V35.5605C11.8516 37.7426 13.6204 39.5114 15.8025 39.5114H31.606C33.788 39.5114 35.5569 37.7426 35.5569 35.5605V11.8552C35.5569 9.67317 33.788 7.9043 31.606 7.9043Z" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.7773 7.90206V3.95117H29.63V7.90206" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23.707" cy="21.7295" r="1.38281" fill="currentColor" />
      <path d="M17.7773 15.8027V31.6063" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29.6328 15.8027V31.6063" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.7773 23.71H29.63" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DuringJourneyIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M5.92578 35.5594V23.7067C5.92578 18.9915 7.79892 14.4693 11.1331 11.1351C14.4673 7.80087 18.9895 5.92773 23.7048 5.92773C28.4201 5.92773 32.9422 7.80087 36.2764 11.1351C39.6107 14.4693 41.4838 18.9915 41.4838 23.7067V35.5594" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M41.4838 37.5315C41.4838 38.5794 41.0675 39.5843 40.3266 40.3252C39.5857 41.0662 38.5808 41.4824 37.5329 41.4824H35.5575C34.5096 41.4824 33.5047 41.0662 32.7638 40.3252C32.0228 39.5843 31.6066 38.5794 31.6066 37.5315V31.6052C31.6066 30.5573 32.0228 29.5524 32.7638 28.8115C33.5047 28.0706 34.5096 27.6543 35.5575 27.6543H41.4838V37.5315ZM5.92578 37.5315C5.92578 38.5794 6.34203 39.5843 7.08297 40.3252C7.82391 41.0662 8.82883 41.4824 9.87667 41.4824H11.8521C12.9 41.4824 13.9049 41.0662 14.6458 40.3252C15.3868 39.5843 15.803 38.5794 15.803 37.5315V31.6052C15.803 30.5573 15.3868 29.5524 14.6458 28.8115C13.9049 28.0706 12.9 27.6543 11.8521 27.6543H5.92578V37.5315Z" stroke="currentColor" strokeWidth="2.76562" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TopicArrowIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4.9375 11.8525H18.7656" stroke="currentColor" strokeWidth="1.97545" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.8516 4.94043L18.7656 11.8545L11.8516 18.7685" stroke="currentColor" strokeWidth="1.97545" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getTopicIcon(iconKey?: string) {
  switch (iconKey) {
    case "accommodation":
      return AccommodationIcon
    case "payments":
      return PaymentsIcon
    case "before-travel":
      return BeforeTravelIcon
    case "during-journey":
      return DuringJourneyIcon
    case "planning":
    default:
      return PlanningIcon
  }
}

export interface FaqListPreviewProps {
  section?: any
}

export function FaqListPreview({ section }: FaqListPreviewProps) {
  const faqList = section || emptyFaqList
  const items: any[] = Array.isArray(faqList.items) && faqList.items.length > 0
    ? faqList.items
    : Array.isArray(faqList.topics) && faqList.topics.length > 0
    ? faqList.topics
    : emptyFaqList.items
  const topics = items
  const advice = faqList.personalAdvice || emptyFaqList.personalAdvice

  const [activeTopicId, setActiveTopicId] = useState<string>(topics[0]?.id || "planning")
  const [openQuestionIds, setOpenQuestionIds] = useState<Set<string>>(new Set(["pj-1", "q-1-1"]))

  const activeTopic = topics.find((t) => t.id === activeTopicId) || topics[0] || { title: "", questions: [] }
  const questions: any[] = Array.isArray(activeTopic.questions) ? activeTopic.questions : []

  const toggleQuestion = (qId: string) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev)
      if (next.has(qId)) {
        next.delete(qId)
      } else {
        next.add(qId)
      }
      return next
    })
  }

  const areAllOpen = questions.length > 0 && questions.every((q) => openQuestionIds.has(q.id))

  const toggleAll = () => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev)
      questions.forEach((q) => {
        if (areAllOpen) next.delete(q.id)
        else next.add(q.id)
      })
      return next
    })
  }

  const handleTopicChange = (topicId: string) => {
    setActiveTopicId(topicId)
    const target = topics.find((t) => t.id === topicId)
    if (target && target.questions && target.questions.length > 0) {
      setOpenQuestionIds(new Set([target.questions[0].id]))
    }
  }

  return (
    <section className="w-full pb-16 md:pb-20 xl:pb-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div>
          {/* Section Title */}
          {faqList.title && (
            <DynamicStyledTextPreview
              as="h2"
              data={faqList.title}
              className="mb-8 md:mb-12 xl:mb-16 font-heading text-[26px] md:text-[30px] xlg:text-[33px] xl:text-[37px] font-semibold text-dashboard-title-dark leading-11 md:leading-12 xlg:leading-13 xl:leading-14"
            />
          )}

          {/* Topic Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8 mb-14 md:mb-20 xl:mb-24">
            {topics.map((topic: any, idx: number) => {
              const Icon = getTopicIcon(topic.icon)
              const isActive = topic.id === activeTopicId

              return (
                <button
                  key={topic.id || idx}
                  type="button"
                  onClick={() => handleTopicChange(topic.id)}
                  className={`cursor-pointer group relative flex flex-col justify-between items-start text-left overflow-hidden xl:pt-[37.25px] xlg:pt-[33.25px] md:pt-[31px] pt-7 xl:pb-[27.09px] xlg:pb-6 md:pb-[22px] pb-[18px] xl:px-[30.478px] xlg:px-[26px] px-6 rounded-[20px] border ${
                    isActive ? "border-accent bg-accent/[0.04]" : "border-dashboard-card-border hover:border-accent/40 bg-card"
                  } transition-colors duration-300 ease-out`}
                >
                  <div className="relative z-10 w-full">
                    <Icon
                      className={`xl:size-12 xlg:size-10 md:size-9 size-7 ${
                        isActive ? "text-accent" : "text-dashboard-muted group-hover:text-accent"
                      } mb-2.5 md:mb-3 xlg:mb-3.5 xl:mb-4 transition-colors duration-300 ease-out`}
                    />

                    <h3
                      className={`${
                        isActive ? "text-accent" : "group-hover:text-accent"
                      } text-base md:text-[18px] xlg:text-[20px] xl:text-[22.859px] font-semibold font-heading xl:leading-[34.288px] leading-6 md:leading-7 xlg:leading-8 transition-colors duration-300 ease-out`}
                    >
                      {typeof topic.title === "object" ? topic.title.value : topic.title}
                    </h3>
                    <p className="text-base md:text-[18px] xl:text-[20px] font-normal text-dashboard-muted leading-6 md:leading-7 xl:leading-8 mt-1.5 md:mt-2 xl:mt-2.5 max-w-[252.293px]">
                      {typeof topic.description === "object" ? topic.description.value : topic.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-2.5 md:pt-3 xlg:pt-3.5 xl:pt-4 w-full flex items-center justify-start">
                    <TopicArrowIcon
                      className={`md:size-5 size-4 xl:size-6 ${
                        isActive ? "text-accent translate-x-1" : "text-dashboard-muted group-hover:text-accent group-hover:translate-x-1.5"
                      } transition-all duration-300 ease-out`}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2-Column: Active Topic Accordion (Left) & Personal Advice Card (Right) */}
        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 md:gap-10 xlg:gap-12 xl:gap-[54px] w-full">
          {/* Left Column: Accordion Questions */}
          <div className="w-full lg:w-[62%] xl:w-[65%] flex flex-col">
            <div className="flex items-center justify-between pb-2.5 border-b border-dashboard-card-border">
              <h3 className="font-heading text-[26px] md:text-[30px] xlg:text-[33px] xl:text-[37px] font-semibold text-dashboard-title-dark leading-11 md:leading-12 xlg:leading-13 xl:leading-14">
                {typeof activeTopic.title === "object" ? activeTopic.title.value : activeTopic.title}
              </h3>
              <button
                type="button"
                onClick={toggleAll}
                className="group flex items-center gap-2 md:gap-2.5 text-accent hover:text-accent/80 transition-colors text-sm md:text-base xlg:text-[18px] xl:text-[21.165px] font-normal outline-none cursor-pointer"
              >
                <span>{areAllOpen ? "Collapse all" : "Expand all"}</span>
                <div className="size-5 md:size-6 xl:size-7 flex items-center justify-center">
                  {areAllOpen ? (
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  ) : (
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="12" y1="5" x2="12" y2="19" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            <div className="divide-y divide-dashboard-card-border">
              {questions.map((item: any, qIdx: number) => {
                const qId = item.id || `q-${qIdx}`
                const isOpen = openQuestionIds.has(qId)
                const qTitle = typeof item.question === "object" ? item.question.value : item.question
                const qAnswer = typeof item.answer === "object" ? item.answer.value : item.answer

                return (
                  <div key={qId}>
                    <button
                      type="button"
                      onClick={() => toggleQuestion(qId)}
                      aria-expanded={isOpen}
                      className="w-full py-6 md:py-7 flex items-center justify-between gap-4 text-left group cursor-pointer outline-none rounded-sm"
                    >
                      <span
                        className={`font-heading text-[15px] md:text-base lgx:text-[18px] xlg:text-[20px] xl:text-[22.859px] font-semibold leading-6 md:leading-7 xlg:leading-[30px] xl:leading-[34.288px] transition-colors duration-200 ${
                          isOpen ? "text-accent" : "text-dashboard-title-dark group-hover:text-accent"
                        }`}
                      >
                        {qTitle}
                      </span>
                      <div
                        className={`xl:size-7 md:size-6 size-5 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 ease-out ${
                          isOpen ? "text-accent rotate-180" : "text-dashboard-muted group-hover:text-accent"
                        }`}
                      >
                        {isOpen ? (
                          <svg className="xl:size-5 md:size-4 size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        ) : (
                          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <line x1="12" y1="5" x2="12" y2="19" />
                          </svg>
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="pb-7 pr-4 xlg:pr-6 xl:pr-13">
                        <p className="text-dashboard-muted text-[14px] md:text-[17.5px] xlg:text-[19.5px] xl:text-[22px] leading-6 md:leading-7 xlg:leading-8 xl:leading-[37.421px] max-w-[1061.661px] whitespace-pre-line">
                          {qAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: "Need personal advice?" Card */}
          <div className="w-full lg:w-[38%] xl:w-[35%] lg:sticky lg:top-28">
            <div className="bg-card rounded-[23.705px] border border-dashboard-card-border px-5 py-6 md:py-7 xlg:py-8 xl:py-10 md:px-6 xlg:px-7 xl:px-9 shadow-sm">
              {advice.title && (
                <DynamicStyledTextPreview
                  as="h3"
                  data={advice.title}
                  className="font-heading text-[22px] md:text-[24px] xlg:text-[26px] xl:text-[30px] font-medium text-dashboard-title-dark leading-8 md:leading-9 xlg:leading-11 xl:leading-[45.717px]"
                />
              )}
              <div className="w-16 h-[2.5px] bg-accent rounded-[1.693px] lgx:mt-2.5 md:mt-2.5 lg:mt-1.5 mt-2 xl:mb-6 lgx:mb-5 md:mb-5 mb-4 lg:mb-3" />
              {advice.description && (
                <DynamicStyledTextPreview
                  as="p"
                  data={advice.description}
                  className="text-dashboard-muted md:text-base text-[15px] xlg:text-[18px] xl:text-[21.165px] leading-6 md:leading-7 xlg:leading-8 xl:leading-[35.981px] mb-6 md:mb-7 lgx:mb-7 lg:mb-4 xl:mb-9"
                />
              )}

              <div className="divide-y divide-dashboard-card-border">
                {/* Phone Link */}
                <a
                  href={advice.phoneHref || "tel:+441234567890"}
                  className="group py-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 md:gap-4 xl:gap-5">
                    <div className="size-9 md:size-10 xlg:size-12 xl:size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <svg className="size-4 md:size-5 xlg:size-6 xl:size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base md:text-[17px] xlg:text-[19px] xl:text-[21.165px] leading-6 md:leading-7 xl:leading-[31.748px] font-semibold text-dashboard-title-dark group-hover:text-accent transition-colors">
                        {advice.phoneTitle || "Call Us"}
                      </div>
                      <div className="text-[15px] md:text-[16px] xlg:text-[18px] xl:text-[20.319px] xl:leading-[30.478px] xlg:leading-7 md:leading-[26px] leading-6 text-dashboard-muted mt-0.5">
                        {advice.phoneValue || "+44 123 456 7890"}
                      </div>
                    </div>
                  </div>
                  <svg className="xl:size-5 md:size-4 size-3 text-dashboard-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>

                {/* Email Link */}
                <a
                  href={advice.emailHref || "mailto:info@mira.travel"}
                  className="group py-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 md:gap-4 xl:gap-5">
                    <div className="size-9 md:size-10 xlg:size-12 xl:size-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                      <svg className="size-4 md:size-5 xlg:size-6 xl:size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base md:text-[17px] xlg:text-[19px] xl:text-[21.165px] leading-6 md:leading-7 xl:leading-[31.748px] font-semibold text-dashboard-title-dark group-hover:text-accent transition-colors">
                        {advice.emailTitle || "Email Us"}
                      </div>
                      <div className="text-[15px] md:text-[16px] xlg:text-[18px] xl:text-[20.319px] xl:leading-[30.478px] xlg:leading-7 md:leading-[26px] leading-6 text-dashboard-muted mt-0.5">
                        {advice.emailValue || "info@mira.travel"}
                      </div>
                    </div>
                  </div>
                  <svg className="xl:size-5 md:size-4 size-3 text-dashboard-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>

                {/* Plan Link */}
                <a
                  href={advice.planHref || "/contact-us"}
                  className="group pt-5 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3 md:gap-4 xl:gap-5">
                    <div className="size-9 md:size-10 xlg:size-12 xl:size-14 rounded-[10px] xl:rounded-[14px] overflow-hidden shrink-0">
                      <UniversalMultimediaPreview
                        multimedia={advice.planImageMultimedia}
                        fallbackAlt="travel-designer"
                        mode="inline"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="text-base md:text-[17px] xlg:text-[19px] xl:text-[21.165px] leading-6 md:leading-7 xl:leading-[31.748px] font-semibold text-dashboard-title-dark group-hover:text-accent transition-colors">
                        {advice.planTitle || "Plan Your Journey"}
                      </div>
                      <p className="text-[15px] md:text-[16px] xlg:text-[18px] xl:text-[20.319px] xl:leading-[30.478px] xlg:leading-7 md:leading-[26px] leading-6 text-dashboard-muted mt-[3px] max-w-[268px] shrink-0">
                        {advice.planDescription || "Tell us what you have in mind and a Mira Travel Specialist will help shape your journey."}
                      </p>
                    </div>
                  </div>
                  <svg className="xl:size-5 md:size-4 size-3 text-dashboard-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqListPreview
