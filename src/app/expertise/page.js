import Image from "next/image";
import {
  Droplets,
  Fingerprint,
  HandHeart,
  Layers,
  Move,
  Route,
  Syringe,
  Target,
  Thermometer,
  Timer,
  UserRound,
  Waves,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Headline from "@/components/Headline";
import Journey from "@/components/Journey";
import RemoteFlow from "@/components/RemoteFlow";
import ContactCta from "@/components/ContactCta";
import {
  definition,
  types,
  budapest,
  symptoms,
  questions,
  clinicView,
  sourceNote,
} from "@/content/crps";
import { principles, featured, advanced, otherOptions } from "@/content/treatments";
import { journey } from "@/content/journey";
import { stock } from "@/content/stock";
import PageTransition from "@/components/chrome/PageTransition";

export const metadata = {
  title: "Expertise: chronic pain, CRPS and neuromodulation",
  description:
    "What Dr Tariq Tramboo treats and how: Complex Regional Pain Syndrome, its diagnosis by the Budapest criteria, spinal cord stimulation, neuromodulation, nerve blocks and rehabilitation.",
  alternates: { canonical: "/expertise" },
};

const jump = [
  { href: "#crps", label: "Main focus: CRPS" },
  { href: "#diagnosis", label: "How it is diagnosed" },
  { href: "#treatments", label: "Treatments" },
  { href: "#options", label: "Other options" },
  { href: "#questions", label: "Common questions" },
];
const typeNumerals = ["I", "II", "N"];
const categoryIcons = [Fingerprint, Thermometer, Droplets, Move];
const principleIcons = [UserRound, Target, Timer];
const treatmentIcons = [Waves, Syringe, Droplets, HandHeart];

export default function ExpertisePage() {
  return (
    <PageTransition>
      <PageHeader
        crumb="Expertise"
        title="Treating pain that outlasts the injury."
        accent="outlasts"
        intro="Dr Tramboo treats chronic pain, with a particular focus on Complex Regional Pain Syndrome and the advanced treatments used for it."
        jump={jump}
      />

      <Section
        id="crps"
        tone="white"
        eyebrow="Main focus"
        title="Complex Regional Pain Syndrome."
        accent="Pain Syndrome"
        sub={definition.summary}
      >
        <div className="grid-2" data-stagger>
          <div className="card soft">
            <span className="icon-badge lg dark" aria-hidden="true">
              <Route />
            </span>
            <span className="tag block">How it behaves</span>
            <h3>Starts distally, beyond a single nerve</h3>
            <p>{definition.behaviour}</p>
          </div>
          <div className="card soft">
            <span className="icon-badge lg dark" aria-hidden="true">
              <Layers />
            </span>
            <span className="tag block">What comes with it</span>
            <h3>More than pain</h3>
            <p>{definition.changes}</p>
          </div>
        </div>
        <div className="grid-3" data-stagger style={{ marginTop: 22 }}>
          {types.map((type, index) => (
            <div className="card hover spot" data-tilt key={type.label}>
              <span className="type-num" aria-hidden="true">
                {typeNumerals[index]}
              </span>
              <span className="tag block">{type.label}</span>
              <h3>{type.title}</h3>
              <p>{type.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Journey steps={journey} />

      <section className="section tint" id="diagnosis">
        <div className="wrap split top">
          <div className="sticky">
            <span className="eyebrow" data-reveal>
              Diagnosis
            </span>
            <h2 className="words" style={{ fontSize: "clamp(34px, 4.6vw, 62px)", margin: "18px 0 22px" }}>
              <Headline text="The Budapest criteria." accent="Budapest" />
            </h2>
            <p data-reveal style={{ color: "var(--soft)", fontSize: 18.5, maxWidth: "48ch", marginBottom: 34 }}>
              {budapest.intro}
            </p>
            <ol className="crit" data-stagger>
              {budapest.criteria.map((text, index) => (
                <li key={text}>
                  <b>{index + 1}</b>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid-2" data-stagger>
            {budapest.categories.map((category, index) => {
              const Icon = categoryIcons[index];
              return (
                <div className="card hover spot" key={category.title}>
                  <span className="icon-badge lg" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="tag block">Category {index + 1}</span>
                  <h3>{category.title}</h3>
                  <p>{category.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Section id="symptoms" tone="white" eyebrow="Symptoms" title="Signs to watch for." accent="watch for">
        <div className="split top">
          <ul className="ticks" data-stagger>
            {symptoms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="card night" data-reveal="right" style={{ padding: 46 }}>
            <span className="tag">In Dr Tramboo&apos;s words</span>
            <p className="quote" style={{ margin: "20px 0 22px", color: "#fff" }}>
              “{clinicView.quote}”
            </p>
            <p>{clinicView.text}</p>
          </div>
        </div>
      </Section>

      <Section
        id="treatments"
        eyebrow="Treatments"
        title="The most advanced treatments possible."
        accent="treatments"
        sub="The goal is pain relief and restored function, with a plan tailored to each patient and started as early as possible."
      >
        <div className="grid-3" data-stagger>
          {principles.map((item, index) => {
            const Icon = principleIcons[index];
            return (
              <div className="card soft" key={item.title}>
                <span className="icon-badge lg dark" aria-hidden="true">
                  <Icon />
                </span>
                <span className="tag block">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>

        <div className="card feature" data-reveal style={{ marginTop: 22 }}>
          <div className="feature-body">
            <span className="tag">{featured.label}</span>
            <h3>{featured.title}</h3>
            <p>{featured.text}</p>
          </div>
          <div className="feature-media">
            <Image src={stock.scsXray.src} alt={stock.scsXray.alt} fill sizes="(max-width: 1080px) 100vw, 560px" data-parallax="0.06" />
            <span className="sample">Sample image</span>
          </div>
        </div>

        <div className="grid-2" data-stagger style={{ marginTop: 22 }}>
          {advanced.map((item, index) => {
            const Icon = treatmentIcons[index];
            return (
              <div className="card hover spot" data-tilt key={item.title}>
                <span className="icon-badge lg" aria-hidden="true">
                  <Icon />
                </span>
                <span className="tag block">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.steps ? (
                  <ol className="steps-inline">
                    {item.steps.map((step, stepIndex) => (
                      <li key={step}>
                        <b>{stepIndex + 1}</b>
                        {step}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        id="options"
        tone="tint"
        eyebrow="Other options"
        title="What else a plan may include."
        accent="may include"
        sub="Medications used for CRPS are usually meant to deal with neuropathic pain. Depending on the patient, a plan may also draw on the following."
      >
        <ul className="chips" data-stagger>
          {otherOptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="questions" tone="white" eyebrow="Questions" title="Common questions about CRPS." accent="questions">
        <div className="faq" data-reveal>
          {questions.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <i aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <p className="note">{sourceNote}</p>
      </Section>

      <Section
        id="remote"
        eyebrow="Remote advice"
        title="Advice for patients anywhere."
        accent="anywhere"
        sub="Dr Tramboo also advises patients around the world by email and WhatsApp."
      >
        <RemoteFlow />
      </Section>

      <ContactCta
        title="Discuss your treatment."
        accent="treatment"
        text="Send your history and reports on WhatsApp or email for advice on next steps."
      />
    </PageTransition>
  );
}
