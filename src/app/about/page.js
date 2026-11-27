import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, AtSign, ChevronRight, Mail, MessageCircle, Phone } from "lucide-react";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import ContactCta from "@/components/ContactCta";
import { Testimonials } from "@/components/Proof";
import { doctor, pillars } from "@/content/doctor";
import { site } from "@/content/site";
import PageTransition from "@/components/chrome/PageTransition";

export const metadata = {
  title: "About Dr Tariq Tramboo",
  description:
    "Dr Tariq Ahmad Tramboo, MBBS, MD, FIPP (USA): pain physician in Srinagar, Kashmir, course director for pain procedure workshops, and chair of SpineLoop International.",
  alternates: { canonical: "/about" },
};

const links = [
  { icon: MessageCircle, label: "WhatsApp", href: site.whatsappHref },
  { icon: Phone, label: "Call", href: site.phoneHref },
  { icon: Mail, label: "Email", href: `mailto:${site.email}` },
  { icon: AtSign, label: "Twitter", href: site.twitter },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <header className="page-head">
        <div className="aurora" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="dots" aria-hidden="true" />
        <div className="wrap split">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb" data-load>
              <Link href="/">Home</Link>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">About</span>
            </nav>
            <h1 className="words" data-load>
              <Headline text={doctor.name} accent="Tramboo" />
            </h1>
            <p className="lead" data-load style={{ "--d": "260ms" }}>
              Pain physician in Srinagar, Kashmir, course director for hands-on procedure workshops,
              and chair of SpineLoop International.
            </p>
            <ul className="creds" data-load style={{ "--d": "340ms" }}>
              {doctor.credentials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="pill-links" data-load style={{ marginTop: 30, "--d": "420ms" }}>
              {links.map((link) => (
                <a className="pill-link" key={link.label} href={link.href}>
                  <link.icon aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="portrait" data-load="scale" data-tilt style={{ "--d": "200ms" }}>
            <Image
              src="/images/Tariq_trumboo.jpg"
              alt="Dr Tariq Ahmad Tramboo beside medical imaging equipment"
              fill
              preload
              sizes="(max-width: 1080px) 100vw, 600px"
            />
          </div>
        </div>
      </header>

      <section className="section white">
        <div className="wrap split top">
          <div>
            <span className="eyebrow" data-reveal>
              Profile
            </span>
            <div className="prose" data-reveal style={{ marginTop: 22 }}>
              {doctor.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="roles" data-stagger>
              {doctor.roles.map((role) => (
                <li key={role.title}>
                  <b>{role.title}</b>
                  <span>{role.place}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card night" data-reveal="right" style={{ padding: 50 }}>
            <span className="tag">In his words</span>
            <p className="quote" style={{ margin: "22px 0 0", color: "#fff" }}>
              “{doctor.quote}”
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="What he does" title="Three sides of one practice." accent="one practice">
        <div className="grid-3" data-stagger>
          {pillars.map((pillar) => (
            <Link className="card hover spot" href={pillar.href} key={pillar.tag}>
              <span className="card-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
              <span className="tag">{pillar.tag}</span>
              <h3 style={{ marginTop: 14 }}>{pillar.title}</h3>
              <p>{pillar.text}</p>
              <p style={{ marginTop: 22, fontWeight: 600, color: "var(--teal-deep)", fontSize: 15 }}>{pillar.cta}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="white" eyebrow="With patients" title="A moment together in Srinagar." accent="together">
        <div className="photo tall" data-reveal="scale">
          <Image
            src="/images/Happy_patient.jpg"
            alt="Dr Tramboo standing with a group of people in a clinic reception"
            fill
            sizes="(max-width: 1240px) 100vw, 1240px"
            data-parallax="0.06"
          />
        </div>
      </Section>

      <Section
        tone="tint"
        eyebrow="Patient stories"
        title="What relief means to patients."
        accent="relief"
        center
      >
        <Testimonials />
      </Section>

      <ContactCta
        title={`Consult ${site.shortName}.`}
        accent={site.shortName}
        text="Send your reports on WhatsApp or email to arrange a consultation."
      />
    </PageTransition>
  );
}
