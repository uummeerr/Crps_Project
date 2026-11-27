// Heading text split into words so each word can rise into place (see the
// ".words" rules in globals.css). Put the result inside an element with the
// "words" class.

// One run of text, one clipped span per word. `start` continues the stagger
// count from an earlier run in the same heading.
export function Words({ text, start = 0 }) {
  return text.split(/\s+/).filter(Boolean).map((word, index) => (
    <span key={`${index}-${word}`}>
      {index > 0 ? " " : null}
      <span className="w" style={{ "--i": start + index }}>
        <span>{word}</span>
      </span>
    </span>
  ));
}

const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

// A heading with one phrase set in the accent colour, for example
// text "Pain that outlasts the injury." with accent "outlasts".
export default function Headline({ text, accent }) {
  if (!accent || !text.includes(accent)) return <Words text={text} />;

  const at = text.indexOf(accent);
  const before = text.slice(0, at).trim();
  const after = text.slice(at + accent.length).trim();
  const afterStart = wordCount(before) + wordCount(accent);
  // Punctuation straight after the accent stays attached to it.
  const joinAfter = /^[.,;:!?]/.test(after) ? "" : " ";

  return (
    <>
      {before ? (
        <>
          <Words text={before} />{" "}
        </>
      ) : null}
      <span className="serif">
        <Words text={accent} start={wordCount(before)} />
      </span>
      {after ? (
        <>
          {joinAfter}
          <Words text={after} start={afterStart} />
        </>
      ) : null}
    </>
  );
}
