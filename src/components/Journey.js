import Headline from "./Headline";
import SignalLine from "./SignalLine";

// "The signal, traced" on the expertise page: the four steps from trigger to
// treatment plan, listed, beside a small card with a live pain-to-relief signal.
export default function Journey({ steps }) {
  return (
    <section className="journey" aria-labelledby="journey-title">
      <div className="wrap journey-grid">
        <div>
          <span className="eyebrow" data-reveal>
            The signal, traced
          </span>
          <h2 className="words" id="journey-title">
            <Headline text="From a single trigger to a treatment plan." accent="treatment plan" />
          </h2>
          <ol className="journey-steps" data-stagger>
            {steps.map((step, index) => (
              <li key={step.label}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{step.label}</span>
                <p>
                  {step.title} {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="journey-signal" data-reveal>
          <SignalLine />
        </div>
      </div>
    </section>
  );
}
