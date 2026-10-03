import type { StoryData } from "../../config/storyTypes"
import { emptyBlocks, emptyBlocksBackgroundMultimedia } from "./emptyBlocks"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { ParagraphPreview } from "./paragraph"
import { QuotePreview } from "./quote"
import { ImageBlockPreview } from "./image"
import { VideoBlockPreview } from "./video"
import { SpotlightCardPreview } from "./spotlight"
import { GuidancePreview } from "./guidance"
import { NotesPreview } from "./notes"

export function BlocksPreview({ story }: { story: StoryData }) {
  const blocks = Array.isArray(story?.blocks) && story.blocks.length > 0
    ? story.blocks
    : emptyBlocks

  const bgMultimedia = (story as any)?.blocksBackgroundMultimedia || emptyBlocksBackgroundMultimedia

  if (!blocks || blocks.length === 0) return null

  return (
    <section className="relative w-full xl:py-[84px] lgx:py-[74px] md:py-[60px] py-10 overflow-hidden">
      {/* Section Background Multimedia */}
      <UniversalMultimediaPreview
        multimedia={bgMultimedia}
        mode="background"
        fallbackColor="#FFFFFF"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-[1360px] flex flex-col gap-10 md:gap-14 xl:gap-16">
        {blocks.map((block: any, idx: number) => {
          const type = block.type || "paragraph"

          if (type === "paragraph") return <ParagraphPreview key={idx} block={block} />
          if (type === "quote") return <QuotePreview key={idx} block={block} />
          if (type === "image") return <ImageBlockPreview key={idx} block={block} />
          if (type === "video") return <VideoBlockPreview key={idx} block={block} />
          if (type === "spotlight") return <SpotlightCardPreview key={idx} block={block} />
          if (type === "guidance" || type === "guideline") return <GuidancePreview key={idx} block={block} />
          if (type === "notes") return <NotesPreview key={idx} block={block} />

          return null
        })}
      </div>
    </section>
  )
}

export default BlocksPreview
