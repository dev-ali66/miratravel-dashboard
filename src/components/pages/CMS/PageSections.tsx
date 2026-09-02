import { useParams } from "react-router-dom";
import { HomeForm } from "./Home/HomeForm";
import { NavbarForm } from "./Navbar/NavbarForm";
import { FooterForm } from "./Footer/FooterForm";
import { FaqForm } from "./Faq/FaqForm";
import { ContactForm } from "./Contact/ContactForm";
import { CtaForm } from "./Cta/CtaForm";

export default function PageSections() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  // Route param is encoded as "<pageSlug>&&<pageId>" by the CMS list links.
  const pageSlug = rawSlug?.split("&&")[0];

  if (pageSlug === "home") {
    return <HomeForm />;
  }
  if (pageSlug === "navbar") {
    return <NavbarForm />;
  }
  if (pageSlug === "footer") {
    return <FooterForm />;
  }
  if (pageSlug === "faq") {
    return <FaqForm />;
  }
  if (pageSlug === "contact-us") {
    return <ContactForm />;
  }
  if (pageSlug === "cta") {
    return <CtaForm />;
  }

  return (
    <div className="p-6">
      <h2 className="font-semibold">
        {pageSlug} CMS
      </h2>

      <p className="text-sm text-muted-foreground mt-1">
        This CMS page is not configured yet.
      </p>
    </div>
  );
}
