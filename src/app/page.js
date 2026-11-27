import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, HandHeart, Syringe, Waves } from "lucide-react";
import Hero from "@/components/Hero";
import HomeAbout from "@/components/HomeAbout";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import Film from "@/components/Film";
import RemoteFlow from "@/components/RemoteFlow";
import ContactCta from "@/components/ContactCta";
import BlogCard from "@/components/BlogCard";
import PageTransition from "@/components/chrome/PageTransition";
import Passage from "@/components/passage/Passage";
import Progress from "@/components/fx/Progress";
import HorizontalRail from "@/components/fx/HorizontalRail";
import StoryChapter from "@/components/scene/StoryChapter";
import { Stats, Testimonials } from "@/components/Proof";
import { definition } from "@/content/crps";
import { featured, advanced } from "@/content/treatments";
import { courses } from "@/content/workshops";
import { journey } from "@/content/journey";
import { stock } from "@/content/stock";
import { getPosts, toCard } from "@/lib/blog";

const treatmentIcons = [Waves, Syringe, Droplets, HandHeart];
// Panels in the sideways gallery: the main focus, the featured treatment,
// then the four treatments.
const railCount = 2 + advanced.length;
const railNumber = (index) => `${String(index + 1).padStart(2, "0")} / ${String(railCount).padStart(2, "0")}`;

export default function HomePage() {
  const latest = getPosts().slice(0, 3).map(toCard);

  return (
    <PageTransition>
      {/* As the hero scrolls away, its two halves drift apart. */}
      <Progress className="hero-fx" start="top top" end="bottom top">
        <Hero />
      </Progress>

      {/* About rises over the foot of the hero as a white sheet. */}
      <HomeAbout />

      <Section tight>
        <Stats />
      </Section>

      {/* From here to the closing band, a film plays behind the page as it
          scrolls: into the scanner, up the stimulator leads, along the nerves. */}
      <Passage>
        <StoryChapter steps={journey} />

        {/* Expertise: pinned on wide screens, the panels travel sideways. */}
        <HorizontalRail
          count={railCount}
          label="Areas of expertise"
          head={
            <div className="head-row" id="expertise">
              <div className="section-head">
                <span className="eyebrow" data-reveal>
                  Expertise
                </span>
                <h2 className="words">
                  <Headline text="What Dr Tramboo treats, and how." accent="and how" />
                </h2>
              </div>
              <div data-reveal style={{ "--d": "160ms" }}>
                <Link className="btn btn-light" href="/expertise">
                  All areas of expertise
                </Link>
              </div>
            </div>
          }
        >
          <Link className="card night hover rail-panel wide" href="/expertise#crps" style={{ padding: 44 }}>
            <span className="rail-count" style={{ color: "var(--mint)" }}>
              {railNumber(0)}
            </span>
            <span className="tag">Main focus</span>
            <h3 style={{ fontSize: "clamp(28px, 3vw, 40px)", margin: "14px 0 12px" }}>Complex Regional Pain Syndrome</h3>
            <p style={{ fontSize: 17 }}>{definition.summary}</p>
            <span className="link" style={{ color: "var(--mint)", marginTop: 22, alignSelf: "flex-start" }}>
              Understand CRPS
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>

          <Link className="photo rail-panel wide" href="/expertise#treatments">
            <Image src={stock.scsXray.src} alt={stock.scsXray.alt} fill sizes="(max-width: 760px) 86vw, 560px" />
            <span className="sample">Sample image</span>
            <div className="photo-text">
              <small>{railNumber(1)} · Featured treatment</small>
              <h3>{featured.title}</h3>
              <p>{featured.text}</p>
            </div>
          </Link>

          {advanced.map((item, index) => {
            const Icon = treatmentIcons[index];
            return (
              <div className="card hover spot rail-panel" key={item.title}>
                <span className="rail-count">{railNumber(index + 2)}</span>
                <span className="icon-badge lg" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </HorizontalRail>

        <Section
          tone="tint"
          eyebrow="In practice"
          title="See where the work happens."
          accent="the work"
          sub="A short film from Dr Tramboo's practice in Srinagar."
          center
        >
          {/* The frame grows from a card to full size as it scrolls into view. */}
          <Progress className="grow" start="top 95%" end="center 58%">
            <Film
              src="/images/video.mp4"
              loop="/images/video-loop.mp4"
              poster="/images/Happy_patient.jpg"
              title="In practice, Srinagar"
              label="Play film"
            />
          </Progress>
        </Section>

        <Section
          tone="white"
          eyebrow="Teaching"
          title="Training other pain physicians."
          accent="pain physicians"
          sub="Hands-on workshops in basic and advanced pain procedures under ultrasound and C-arm guidance, directed by Dr Tramboo."
          aside={
            <Link className="btn btn-light" href="/workshops">
              About the workshops
            </Link>
          }
        >
          <div className="grid-3">
            <div className="photo span-2" data-reveal>
              <Image
                src="/images/training-lab.jpg"
                alt="Training lab with C-arm X-ray machines at numbered stations"
                fill
                sizes="(max-width: 1080px) 100vw, 820px"
                data-parallax="0.07"
              />
              <div className="photo-text">
                <small>Training lab</small>
                <h3>Procedures under ultrasound and C-arm.</h3>
              </div>
            </div>
            <div className="card soft" data-reveal style={{ "--d": "120ms" }}>
              <span className="tag">Past courses</span>
              <ul className="rows" style={{ marginTop: 14 }}>
                {courses.map((course) => (
                  <li key={course.city}>
                    {course.city}
                    <span>{course.dates}</span>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 22 }}>Both courses have taken place. Get in touch for the next dates.</p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Patient stories"
          title="What relief means to patients."
          accent="relief"
          sub="Patients describe their experience in their own words."
          center
        >
          <Testimonials />
        </Section>

        <Section
          tone="white"
          eyebrow="Writing"
          title="From the blog."
          accent="blog"
          sub="Articles on pain medicine and the treatments behind it."
          aside={
            <Link className="btn btn-light" href="/blog">
              All articles
            </Link>
          }
        >
          <div className="blog-grid" data-stagger>
            {latest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Remote advice"
          title="Advice for patients anywhere."
          accent="anywhere"
          sub="Dr Tramboo also advises patients around the world by email and WhatsApp."
        >
          <RemoteFlow />
        </Section>

        <ContactCta />
      </Passage>
    </PageTransition>
  );
}
