import { useParams } from "react-router-dom"
import { HomeForm } from "./Home/HomeForm"
import { AboutForm } from "./About/AboutForm"
import { JourneyCMSForm } from "./Journey/JourneyCMSForm"
import { StoriesCMSForm } from "./Stories/StoriesCMSForm"
import { NewsletterCMSForm } from "./Newsletter/NewsletterCMSForm"
import { FaqForm } from "./Faq/FaqForm"
import { ContactForm } from "./Contact/ContactForm"
import { FooterForm } from "./Footer/FooterForm"

export default function PageSections() {
  const { slug: rawSlug } = useParams<{ slug: string }>()
  // Route param is encoded as "<pageSlug>&&<pageId>" by the CMS list links.
  const pageSlug = rawSlug?.split("&&")[0]

  if (pageSlug === "home") {
    return <HomeForm />
  }
  if (pageSlug === "about-us" || pageSlug === "about") {
    return <AboutForm />
  }
  if (pageSlug === "journey" || pageSlug === "journeys") {
    return <JourneyCMSForm />
  }
  if (pageSlug === "stories") {
    return <StoriesCMSForm />
  }
  if (pageSlug === "newsletter") {
    return <NewsletterCMSForm />
  }
  if (pageSlug === "faq") {
    return <FaqForm />
  }
  if (pageSlug === "contact-us" || pageSlug === "contact") {
    return <ContactForm />
  }
  if (pageSlug === "footer") {
    return <FooterForm />
  }

  return (
    <div className="p-6">
      <h2 className="font-semibold">{pageSlug} CMS</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        This CMS page is not configured yet.
      </p>
    </div>
  )
}
