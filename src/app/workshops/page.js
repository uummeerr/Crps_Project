import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import ContactCta from "@/components/ContactCta";
import { overview, courses } from "@/content/workshops";
import PageTransition from "@/components/chrome/PageTransition";

export const metadata = {
  title: "Pain procedure workshops for physicians",
  description:
    "Hands-on workshops in basic and advanced pain procedures under ultrasound and C-arm guidance, directed by Dr Tariq Tramboo.",
  alternates: { canonical: "/workshops" },
};

export default function WorkshopsPage() {
  return (
    <PageTransition>
      <PageHeader
        crumb="Workshops"
        title="Hands-on procedure workshops."
        accent="workshops"
        intro={overview.intro}
      />

      <Section tone="white" eyebrow="Curriculum" title="What the courses cover." accent="cover">
        <div className="grid-3">
          <div className="photo tall span-2" data-reveal>
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
            <span className="tag">Procedures</span>
            <ul className="chips" style={{ marginTop: 18 }}>
              {overview.covers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="past"
        eyebrow="Past courses"
        title="Where we have taught."
        accent="taught"
        sub="Both courses below have already taken place. Get in touch for the next dates."
      >
        <div className="grid-2" data-stagger>
          {courses.map((course) => (
            <div className="card hover spot" key={course.city}>
              <span className="tag">
                {course.city} · {course.dates}
              </span>
              <h3 style={{ marginTop: 14 }}>{course.title}</h3>
              <p>{course.venue}</p>
              <ul className="ticks" style={{ marginTop: 20 }}>
                {course.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid-2" data-stagger style={{ marginTop: 22 }}>
          <div className="photo">
            <Image
              src="/images/neuro-spinal-hospital.jpg"
              alt="Exterior of Neuro Spinal Hospital in Dubai"
              fill
              sizes="(max-width: 760px) 100vw, 600px"
              data-parallax="0.07"
            />
            <div className="photo-text">
              <small>Dubai venue</small>
              <h3>Neuro Spinal Hospital.</h3>
            </div>
          </div>
          <div className="photo">
            <Image
              src="/images/training-lab-stations.jpg"
              alt="Procedure training lab with numbered stations"
              fill
              sizes="(max-width: 760px) 100vw, 600px"
              data-parallax="0.07"
            />
            <div className="photo-text">
              <small>Dubai venue</small>
              <h3>Eight training stations.</h3>
            </div>
          </div>
        </div>
      </Section>

      <ContactCta
        eyebrow="Workshops"
        title="Ask about the next course."
        accent="next course"
        text="Send a message on WhatsApp or email for upcoming dates, faculty and fees."
      />
    </PageTransition>
  );
}
