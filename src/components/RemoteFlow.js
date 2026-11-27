// How a patient who cannot travel gets advice from Dr Tramboo, in three steps.
const steps = [
  {
    title: "Send your history",
    text: "A short history of the injury or the start of the pain, your current symptoms, and any reports or scans, by WhatsApp or email.",
  },
  {
    title: "Your case is reviewed",
    text: "What you send is read, and you may be asked for a few more details.",
  },
  {
    title: "You get advice on next steps",
    text: "You hear back about your options, whether that means treatment near you or a visit to Srinagar.",
  },
];

export default function RemoteFlow() {
  return (
    <ol className="flow" data-stagger>
      {steps.map((step) => (
        <li key={step.title}>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
