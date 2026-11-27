// Proof shown on the home page: headline numbers and patient testimonials.
//
// EVERYTHING IN THIS FILE IS SAMPLE DATA for judging the design. None of it
// comes from the clinic. Each item with `sample: true` is shown on the site
// with a visible "Sample" badge. Before launch, replace the values with the
// clinic's real figures and real patient quotes (used with consent), then
// delete the `sample: true` line from each item you have replaced. Remove any
// item the clinic cannot back up.

export const stats = [
  { value: 20, suffix: "+", label: "Years in pain medicine", sample: true },
  { value: 5000, suffix: "+", label: "Patients treated", sample: true },
  { value: 30, suffix: "+", label: "Countries advised remotely", sample: true },
  { value: 400, suffix: "+", label: "Physicians trained", sample: true },
];

export const testimonials = [
  {
    quote:
      "For two years nobody could tell me why a healed fracture still burned. Here I was finally given a diagnosis, and a plan I could understand.",
    name: "Patient name",
    place: "City, Country",
    sample: true,
  },
  {
    quote:
      "I sent my reports by email from abroad and had a clear answer about my options before I ever booked a flight.",
    name: "Patient name",
    place: "City, Country",
    sample: true,
  },
  {
    quote:
      "The trial showed me what relief could feel like before any permanent decision. That gave me the confidence to go ahead.",
    name: "Patient name",
    place: "City, Country",
    sample: true,
  },
];
