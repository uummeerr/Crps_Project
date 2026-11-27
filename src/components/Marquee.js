// A slow, endless strip of short phrases. The list is printed twice so the
// loop has no gap; the copy is hidden from screen readers. It pauses on hover
// and stands still when "reduce motion" is on.
export default function Marquee({ items, label }) {
  return (
    <div className="marquee" role="group" aria-label={label}>
      <ul className="marquee-track">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ul className="marquee-track" aria-hidden="true">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
