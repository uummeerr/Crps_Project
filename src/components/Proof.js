import { Quote } from "lucide-react";
import { stats, testimonials } from "@/content/proof";

// Headline numbers. Each counts up when it scrolls into view (see Motion).
export function Stats() {
  return (
    <div className="stats" data-reveal>
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <span className="stat-num">
            <span data-count={stat.value}>{stat.value.toLocaleString("en-US")}</span>
            <em>{stat.suffix}</em>
          </span>
          <p>{stat.label}</p>
          {stat.sample ? <span className="sample">Sample</span> : null}
        </div>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <div className="grid-3" data-stagger>
      {testimonials.map((item, index) => (
        <figure className="card hover spot testi" key={index}>
          <Quote className="testi-quote" aria-hidden="true" />
          <blockquote>{item.quote}</blockquote>
          <footer>
            <span className="avatar" aria-hidden="true">
              {item.name.charAt(0)}
            </span>
            <span>
              <cite>{item.name}</cite>
              <span>{item.place}</span>
            </span>
            {item.sample ? (
              <span className="sample" style={{ marginLeft: "auto" }}>
                Sample
              </span>
            ) : null}
          </footer>
        </figure>
      ))}
    </div>
  );
}
