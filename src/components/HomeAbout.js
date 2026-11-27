import "@/app/home-about.css";
import Progress from "@/components/fx/Progress";
import Lit from "@/components/fx/Lit";
import AboutRoles from "@/components/AboutRoles";
import { doctor, pillars } from "@/content/doctor";
import { site } from "@/content/site";

// The About section of the home page. It sits straight under the hero and
// rises over it as a white sheet (see home-about.css):
//   1. the opening: his bio as one large statement that lights up word by
//      word, beside a short list of facts
//   2. his three roles (AboutRoles.js): the heading stays in place while three
//      cards stack up beside it, one per role
// --p on the section runs 0 to 1 as its top edge travels up the screen.
export default function HomeAbout() {
  // The clinic is named on the contact page only, so its role is left out.
  const roles = doctor.roles.slice(1);

  return (
    <Progress as="section" className="about" id="about" aria-labelledby="about-title" start="top bottom" end="top 16%">
      <div className="wrap">
        <div className="about-open">
          <div>
            <span className="eyebrow" data-reveal>
              About
            </span>
            <Lit as="p" className="about-lead" text={doctor.statement} accent="chronic pain" start="top 86%" end="bottom 60%" />
          </div>
          <ul className="about-facts" data-stagger>
            <li>
              <small>Credentials</small>
              <strong>{doctor.credentials.join(", ")}</strong>
            </li>
            {roles.map((role) => (
              <li key={role.title}>
                <small>{role.title}</small>
                <strong>{role.place}</strong>
              </li>
            ))}
            <li>
              <small>Based in</small>
              <strong>{site.city}</strong>
            </li>
          </ul>
        </div>

        <AboutRoles pillars={pillars} quote={doctor.quote} more={{ href: "/about", label: `More about ${site.shortName}` }} />
      </div>
    </Progress>
  );
}
