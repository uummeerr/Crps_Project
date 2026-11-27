// Everything about the doctor, used on the home and About pages. Merges the bio post, the bio page and
// the Twitter post from the previous site.

export const doctor = {
  name: "Dr Tariq Ahmad Tramboo",
  credentials: ["MBBS", "MD", "FIPP (USA)"],
  roles: [
    { title: "Head", place: "Relief Pain Clinic, Srinagar, India" },
    { title: "Chair", place: "SpineLoop International" },
    { title: "Course director", place: "Pain procedure workshops" },
  ],
  bio: [
    "Dr Tramboo is a pain physician in Srinagar, Kashmir. He diagnoses and treats chronic pain, with a particular focus on Complex Regional Pain Syndrome.",
    "He is actively involved in research into the treatment of pain, and trains other pain physicians through hands-on procedure workshops.",
  ],
  // The bio as one statement, for the large opening text of the home page's
  // About section. Same wording as `bio`, without the sentence the hero has
  // already said just above it.
  statement:
    "Dr Tramboo diagnoses and treats chronic pain, with a particular focus on Complex Regional Pain Syndrome. He is actively involved in research into the treatment of pain, and trains other pain physicians through hands-on procedure workshops.",
  quote: "CRPS is in the brain and not in the limb.",
};

// What he does, drawn from the three roles the previous site described. Used
// by the About section on the home page and by the About page.
export const pillars = [
  {
    tag: "Physician",
    title: "Treats chronic pain",
    text: "Diagnosis and treatment of chronic pain, with a particular focus on Complex Regional Pain Syndrome.",
    href: "/expertise",
    cta: "Areas of expertise",
  },
  {
    tag: "Teacher",
    title: "Trains pain physicians",
    text: "Directs hands-on workshops in basic and advanced pain procedures under ultrasound and C-arm guidance.",
    href: "/workshops",
    cta: "Workshops",
  },
  {
    tag: "Researcher",
    title: "Researches pain treatment",
    text: "Actively involved in research into the treatment of pain.",
    href: "/blog",
    cta: "Read the blog",
  },
];
