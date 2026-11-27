import Progress from "./Progress";

// Text that lights up word by word as it scrolls through the viewport: words
// start faint and reach full strength one after another. The words are split
// here, on the server; the stylesheet (".lit" in motion.css) works out each
// word's brightness from the scroll progress and the word's position.
//
//   <Lit as="p" text="…" />
//   <Lit as="h2" text="Book a consultation." accent="consultation" />
//
// `accent` is a phrase inside the text to set in the accent colour.
// Without JavaScript, or with reduced motion, every word is fully lit.

function words(text) {
  return text.split(/\s+/).filter(Boolean);
}

function Run({ text, from }) {
  return words(text).map((word, index) => (
    <span key={`${index}-${word}`}>
      {index > 0 ? " " : null}
      <span className="lw" style={{ "--i": from + index }}>
        {word}
      </span>
    </span>
  ));
}

export default function Lit({ as = "p", text, accent, start = "top 84%", end = "bottom 62%", className = "", ...rest }) {
  const total = words(text).length;
  const at = accent ? text.indexOf(accent) : -1;

  let content;
  if (at < 0) {
    content = <Run text={text} from={0} />;
  } else {
    const before = text.slice(0, at).trim();
    const after = text.slice(at + accent.length).trim();
    const beforeCount = words(before).length;
    const accentCount = words(accent).length;
    content = (
      <>
        {before ? (
          <>
            <Run text={before} from={0} />{" "}
          </>
        ) : null}
        <span className="serif">
          <Run text={accent} from={beforeCount} />
        </span>
        {after ? (
          <>
            {/^[.,;:!?]/.test(after) ? "" : " "}
            <Run text={after} from={beforeCount + accentCount} />
          </>
        ) : null}
      </>
    );
  }

  return (
    <Progress as={as} className={`lit ${className}`.trim()} style={{ "--n": total }} start={start} end={end} {...rest}>
      {content}
    </Progress>
  );
}
