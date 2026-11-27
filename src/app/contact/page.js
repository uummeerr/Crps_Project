import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import RemoteFlow from "@/components/RemoteFlow";
import { site } from "@/content/site";
import { stock } from "@/content/stock";
import PageTransition from "@/components/chrome/PageTransition";

export const metadata = {
  title: "Contact and consultations",
  description:
    "Book a consultation with Dr Tariq Tramboo at Relief Pain Clinic, Srinagar, by WhatsApp, phone or email.",
  alternates: { canonical: "/contact" },
};

const toSend = [
  "A short history of the injury or the start of the pain",
  "Current symptoms and how long they have lasted",
  "Reports, scans and details of treatment so far",
];

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.phoneDisplay,
    note: "The quickest way to send reports and photos.",
    href: site.whatsappHref,
    night: true,
  },
  {
    icon: Phone,
    label: "Call",
    value: site.phoneDisplay,
    note: "For appointments in Srinagar.",
    href: site.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    note: "For detailed histories and workshop enquiries.",
    href: `mailto:${site.email}`,
    small: true,
  },
];

export default function ContactPage() {
  return (
    <PageTransition>
      <PageHeader
        crumb="Contact"
        title="Book a consultation."
        accent="consultation"
        intro={`${site.shortName} sees patients at ${site.practice.name} in Srinagar. Send your information on WhatsApp or email; patients outside India can also be advised remotely.`}
      />

      <Section tone="white" tight>
        <div className="grid-3" data-stagger>
          {channels.map((channel) => (
            <a
              className={`card hover spot contact-card${channel.night ? " night" : ""}`}
              key={channel.label}
              href={channel.href}
            >
              <span className={`icon-badge lg${channel.night ? "" : " dark"}`} aria-hidden="true">
                <channel.icon />
              </span>
              <span className="card-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
              <span style={{ marginTop: "auto", paddingTop: 30 }}>
                <span className="tag">{channel.label}</span>
                <span className={`big${channel.small ? " small" : ""}`} style={{ display: "block", paddingTop: 8 }}>
                  {channel.value}
                </span>
              </span>
              <p style={{ marginTop: 10 }}>{channel.note}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section eyebrow="Before you write" title="What to send, and where to find us." accent="where to find us">
        <div className="grid-2">
          <div className="card" data-reveal style={{ padding: 44 }}>
            <span className="tag">What to send</span>
            <ul className="ticks" style={{ marginTop: 20 }}>
              {toSend.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="photo" data-reveal style={{ "--d": "120ms" }}>
            <Image src={stock.dalLake.src} alt={stock.dalLake.alt} fill sizes="(max-width: 760px) 100vw, 600px" data-parallax="0.07" />
            <span className="sample">Sample image</span>
            <div className="photo-text">
              <small>The clinic</small>
              <h3>{site.practice.name}</h3>
              <p>{site.practice.location}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="tint"
        eyebrow="Remote advice"
        title="Cannot travel? Start from home."
        accent="from home"
        sub="Dr Tramboo also advises patients around the world by email and WhatsApp."
      >
        <RemoteFlow />
      </Section>
    </PageTransition>
  );
}
