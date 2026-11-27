import Headline from "./Headline";

// A page section with an optional heading block.
//   tone     "tint" or "white" background; default is the page background
//   accent   the phrase inside `title` set in the accent colour
//   center   centre the heading block
//   aside    a link or button shown to the right of the heading
export default function Section({
  id,
  tone,
  tight,
  eyebrow,
  title,
  accent,
  sub,
  center,
  aside,
  children,
}) {
  const classes = ["section", tone, tight ? "tight" : ""].filter(Boolean).join(" ");

  const head = title ? (
    <div className={`section-head${center ? " center" : ""}`}>
      {eyebrow ? (
        <span className="eyebrow" data-reveal>
          {eyebrow}
        </span>
      ) : null}
      <h2 className="words">
        <Headline text={title} accent={accent} />
      </h2>
      {sub ? (
        <p data-reveal style={{ "--d": "120ms" }}>
          {sub}
        </p>
      ) : null}
    </div>
  ) : null;

  return (
    <section className={classes} id={id}>
      <div className="wrap">
        {head && aside ? (
          <div className="head-row">
            {head}
            <div data-reveal style={{ "--d": "160ms" }}>
              {aside}
            </div>
          </div>
        ) : (
          head
        )}
        {children}
      </div>
    </section>
  );
}
