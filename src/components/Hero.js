import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe, GraduationCap, MapPin, Zap } from "lucide-react";
import Headline from "./Headline";
import { doctor } from "@/content/doctor";
import { site } from "@/content/site";

// Home hero: who the doctor is, on the left; his portrait on the right with
// one card at its foot holding his name and two facts.
export default function Hero() {
  return (
    <header className="hero">
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="dots" aria-hidden="true" />

      <div className="wrap hero-grid">
        <div>
          <p className="pill" data-load>
            <b>{site.role}</b>
            {doctor.name}
          </p>
          <h1 className="words" data-load style={{ "--d": "120ms" }}>
            <Headline text="Rewiring the signal of pain." accent="signal" />
          </h1>
          <p className="hero-lead" data-load style={{ "--d": "420ms" }}>
            {site.shortName} is a pain physician in Srinagar, Kashmir. He treats chronic pain with
            advanced neuromodulation, and trains other physicians to do the same.
          </p>
          <div className="hero-cta" data-load style={{ "--d": "540ms" }}>
            <Link className="btn btn-primary" href="/contact">
              Book a consultation
              <span className="btn-dot" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </Link>
            <Link className="btn btn-light" href="/about">
              Meet {site.shortName}
            </Link>
          </div>
          <ul className="hero-trust" data-load style={{ "--d": "680ms" }}>
            <li>
              <GraduationCap aria-hidden="true" />
              {doctor.credentials.join(", ")}
            </li>
            <li>
              <MapPin aria-hidden="true" />
              {site.city}
            </li>
            <li>
              <Globe aria-hidden="true" />
              Remote advice worldwide
            </li>
          </ul>
        </div>

        <div className="stage" data-load="scale" style={{ "--d": "300ms" }}>
          <div className="stage-ring" aria-hidden="true" />
          <div className="stage-portrait">
            <Image
              src="/images/Tariq_trumboo.jpg"
              alt="Dr Tariq Ahmad Tramboo beside medical imaging equipment"
              fill
              preload
              sizes="(max-width: 1080px) 80vw, 460px"
            />
            {/* All the text on the photo lives in this one card. */}
            <div className="portrait-tag">
              <div className="portrait-who">
                <span className="avatar" aria-hidden="true">
                  {site.initials}
                </span>
                <span>
                  <strong>{doctor.name}</strong>
                  <span>{site.role}</span>
                </span>
              </div>
              <ul className="portrait-facts">
                <li>
                  <Zap aria-hidden="true" />
                  <span>
                    <small>Focus</small>
                    <strong>Spinal cord stimulation</strong>
                  </span>
                </li>
                <li>
                  <GraduationCap aria-hidden="true" />
                  <span>
                    <small>Credentials</small>
                    <strong>{doctor.credentials.join(", ")}</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
