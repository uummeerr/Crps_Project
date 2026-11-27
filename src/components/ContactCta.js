import { ArrowUpRight, Mail } from "lucide-react";
import Lit from "./fx/Lit";
import { site } from "@/content/site";

// The dark closing band at the bottom of every page.
export default function ContactCta({
  eyebrow = "Consultations",
  title = "Book a consultation.",
  accent = "consultation",
  text = "Send your reports on WhatsApp or email. Patients outside India can also be advised remotely.",
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="wrap">
        <span className="eyebrow plain" data-reveal>
          {eyebrow}
        </span>
        {/* The headline fills in word by word as the band scrolls into view. */}
        <Lit as="h2" id="cta-title" text={title} accent={accent} start="top 90%" end="top 36%" />
        <p data-reveal style={{ "--d": "120ms" }}>
          {text}
        </p>
        <div className="cta-row" data-reveal style={{ "--d": "220ms" }}>
          <a className="btn btn-mint" href={site.whatsappHref}>
            WhatsApp {site.phoneDisplay}
            <span className="btn-dot" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </a>
          <a className="btn btn-outline" href={`mailto:${site.email}`}>
            <Mail aria-hidden="true" style={{ width: 18, height: 18 }} />
            Send an email
          </a>
        </div>
      </div>
    </section>
  );
}
