import { Sparkles, Check } from "lucide-react"

function PrincipleIcon({ type }: { type: string }) {
  switch (type) {
    case "character":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 3C14 3 5 9 5 16C5 18.3869 5.94821 20.6761 7.63604 22.364C9.32387 24.0518 11.6131 25 14 25C16.3869 25 18.6761 24.0518 20.364 22.364C22.0518 20.6761 23 18.3869 23 16C23 9 14 3 14 3Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 4V24M4 14H24" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7.5C9 11 11 13 14 14C17 13 19 11 21 7.5" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.5C9 17 11 15 14 14C17 15 19 17 21 20.5" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "comfort":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M4 20V10L14 3L24 10V20" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 14H10V22H18V14Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14V22" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "connection":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 5C10.7 5 8 7.7 8 11C8 15 14 23 14 23C14 23 20 15 20 11C20 7.7 17.3 5 14 5Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return <Sparkles className="w-full h-full text-[#af6348]" />
  }
}

const TITLE_CSS =
  "text-[#313131] text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function AccommodationsPreview({ accommodations, draft }: { accommodations?: any; draft?: any }) {
  const safeAcc = accommodations || draft?.accommodations || {}

  const principles = [
    {
      icon: "character",
      title: "CHARACTER & HERITAGE",
      description: "Historic architecture, authentic regional design, and a genuine sense of place.",
    },
    {
      icon: "location",
      title: "PRIME LOCATION",
      description: "Situated in central, scenic, or peaceful settings close to iconic landmarks.",
    },
    {
      icon: "comfort",
      title: "REFINED COMFORT",
      description: "High-end bedding, marble ensuites, and impeccable personal hospitality.",
    },
    {
      icon: "connection",
      title: "LOCAL CONNECTION",
      description: "Family-run boutique properties fostering warm, personal Balkan hospitality.",
    },
  ]

  const stays =
    safeAcc.staysList && safeAcc.staysList.length > 0
      ? safeAcc.staysList
      : [
          {
            id: "stay-1",
            name: "Plaza Hotel Tirana",
            stayType: "Boutique Luxury Hotel",
            city: "Tirana",
            duration: "2 Nights",
            nights: 2,
            description: "Modern elegance in the heart of Tirana with panoramic city views and luxury spa.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            amenities: ["Spa & Wellness", "Gourmet Dining", "City Views"],
          },
          {
            id: "stay-2",
            name: "Mangalem Heritage House",
            stayType: "Historical Guesthouse",
            city: "Berat",
            duration: "1 Night",
            nights: 1,
            description: "Restored Ottoman residence offering authentic Balkan hospitality and courtyard dining.",
            image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
            amenities: ["Historic Architecture", "Organic Breakfast", "Courtyard Bar"],
          },
        ]

  const standards = [
    "Daily gourmet breakfast included",
    "Complimentary high-speed WiFi",
    "24/7 dedicated reception & concierge",
    "Private ensuite marble bathroom",
    "Handpicked premium organic linens",
    "Signature MIRA welcome gift",
  ]

  return (
    <div className="w-full flex flex-col gap-10">
      {/* 1. Our Philosophy */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#D8CBB8]">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#af6348]">
              ACCOMMODATION PHILOSOPHY
            </span>
            <h2 className={TITLE_CSS}>
              {safeAcc.title || "Handpicked Luxury Stays"}
            </h2>
          </div>
          <p className="text-[#565e69] text-sm md:text-base max-w-xl">
            {safeAcc.description ||
              "We select hotels and boutique guesthouses based on four uncompromising principles of character, location, comfort, and local connection."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden bg-white p-6 rounded-[10px] border border-[#D8CBB8] flex flex-col items-start gap-4 shadow-xs"
            >
              <div className="size-8 flex items-center justify-center">
                <PrincipleIcon type={item.icon} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#080c1d] font-semibold text-sm tracking-wider uppercase group-hover:text-[#af6348] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#565e69] text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Destination Stays */}
      <div className="flex flex-col gap-5 pt-6 border-t border-[#D8CBB8]">
        <h3 className={TITLE_CSS}>Handpicked Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stays.map((stay: any, idx: number) => (
            <div
              key={stay.id || idx}
              className="rounded-[10px] border border-[#D8CBB8] bg-white overflow-hidden shadow-xs flex flex-col"
            >
              <div className="h-[200px] w-full relative">
                <img
                  src={stay.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
                  alt={stay.name}
                  className="w-full h-full object-cover object-center"
                />
                {stay.duration && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-semibold">
                    {stay.duration}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif text-lg font-semibold text-[#080c1d]">
                    {stay.name}
                  </h4>
                  <span className="text-xs text-[#af6348] font-semibold uppercase tracking-wider">
                    {stay.city}
                  </span>
                </div>
                <p className="text-xs text-[#565e69] leading-relaxed">
                  {stay.description}
                </p>
                {stay.amenities && stay.amenities.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2 mt-auto">
                    {stay.amenities.map((am: string, aIdx: number) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-1 rounded-xs bg-[#FAF6F0] text-[#464136] text-[11px] font-medium border border-[#D8CBB8]/60"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Standards Expectations */}
      <div className="flex flex-col gap-4 pt-6 border-t border-[#D8CBB8]">
        <h3 className={TITLE_CSS}>What You Can Expect</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#F9F6ED] rounded-[10px] border border-[#D8CBB8] overflow-hidden">
          {standards.map((st, idx) => (
            <div key={idx} className="p-5 border-b sm:border-b-0 sm:border-r last:border-r-0 border-[#D8CBB8] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#af6348] shrink-0" />
              <span className="text-xs md:text-sm font-medium text-[#464136]">{st}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
