// The blog. Each post has a title, a field, a publish date and time, a short
// excerpt and the article itself.
//
// ALL POSTS BELOW ARE SAMPLE ARTICLES written to test the design. They were
// not written or reviewed by Dr Tramboo. Each one carries `sample: true`,
// which shows a "Sample" badge on its card and a notice on its page. Replace
// them with the doctor's own articles before launch.
//
// To add a post, copy one of the objects in `posts` and change:
//   slug         the last part of the address, e.g. /blog/my-new-post
//   title        the topic name
//   field        one of the keys in `fields` below
//   publishedAt  date and time with the +05:30 India offset
//   image        optional cover photo { src, alt }, 16:9, kept in
//                public/images/blog/. Without one the card shows the
//                field's icon instead. The sample photos are from Unsplash
//                (free to use, no credit required); replace them with the
//                clinic's own along with the articles.
//   excerpt      one or two sentences shown on the card
//   sections     the article: each section has an optional heading and
//                one or more paragraphs
// Reading time is worked out automatically from the length.

// Fields a post can belong to. Each gets a coloured badge and a filter
// button on the blog page. `hue` is the badge colour (0 to 360 on the colour
// wheel). Add a field here before using it in a post.
export const fields = {
  crps: { label: "CRPS", hue: 176 },
  pain: { label: "Pain medicine", hue: 214 },
  neuromodulation: { label: "Neuromodulation", hue: 248 },
  rehabilitation: { label: "Rehabilitation", hue: 148 },
  kidney: { label: "Kidney", hue: 346 },
  liver: { label: "Liver", hue: 26 },
  lungs: { label: "Lungs", hue: 198 },
};

export const posts = [
  {
    slug: "why-early-treatment-changes-crps",
    image: { src: "/images/blog/why-early-treatment-changes-crps.jpg", alt: "Doctor in a white coat holding a stethoscope" },
    title: "Why early treatment changes the course of CRPS",
    field: "crps",
    publishedAt: "2026-11-20T09:30:00+05:30",
    excerpt:
      "CRPS is easier to manage in its first months than after the nervous system has adapted to constant pain. Here is why timing matters so much.",
    sections: [
      {
        paragraphs: [
          "Most patients who reach a pain clinic with CRPS have already been in pain for a long time. Many were told to wait, to rest the limb, or that the pain would settle once the injury healed. With CRPS, waiting is rarely neutral.",
        ],
      },
      {
        heading: "What happens when pain is left alone",
        paragraphs: [
          "In the early phase, the changes of CRPS sit mainly in the affected limb: swelling, colour and temperature change, and pain that is out of proportion to the injury. Over time the nervous system itself can become more sensitive, so that ordinary signals are read as pain.",
          "Once this sensitisation is established, treatment takes longer and the goals shift from reversing the condition to managing it.",
        ],
      },
      {
        heading: "What early treatment looks like",
        paragraphs: [
          "Early treatment is a combination: keeping the limb moving with guided therapy, controlling pain well enough to make that movement possible, and in selected patients, timely nerve blocks.",
          "None of this requires certainty on day one. It requires that CRPS is considered early, and that a patient with pain that does not match the injury is referred sooner, not later.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "budapest-criteria-explained",
    image: { src: "/images/blog/budapest-criteria-explained.jpg", alt: "Stethoscope resting on a white sheet" },
    title: "The Budapest criteria, explained for patients",
    field: "crps",
    publishedAt: "2026-11-12T18:00:00+05:30",
    excerpt:
      "There is no blood test or scan that proves CRPS. Doctors use a checklist called the Budapest criteria. This is what it asks, in plain language.",
    sections: [
      {
        paragraphs: [
          "Patients are often surprised to learn that CRPS is diagnosed in the clinic, by listening and examining, and not by a machine. The Budapest criteria are the agreed checklist that makes that diagnosis consistent from one doctor to the next.",
        ],
      },
      {
        heading: "The three conditions",
        paragraphs: [
          "First, there is continuing pain that is out of proportion to whatever started it. Second, the patient reports symptoms in at least three of four categories, and the doctor finds signs in at least two of them at examination. Third, no other diagnosis explains the picture better.",
        ],
      },
      {
        heading: "The four categories",
        paragraphs: [
          "Sensory: pain from light touch, or an exaggerated response to something mildly painful. Vasomotor: a difference in skin temperature or colour between the two limbs. Sudomotor and edema: swelling, or a difference in sweating. Motor and trophic: stiffness, weakness, tremor, or changes in hair, nails and skin.",
          "Tests are still useful, but mainly to rule out other conditions that can look similar.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "what-a-spinal-cord-stimulator-trial-involves",
    image: { src: "/images/blog/what-a-spinal-cord-stimulator-trial-involves.jpg", alt: "Doctors performing a procedure in an operating theatre" },
    title: "What a spinal cord stimulator trial involves",
    field: "neuromodulation",
    publishedAt: "2026-11-05T11:15:00+05:30",
    excerpt:
      "Before any permanent implant, patients try stimulation for a few days. A short guide to what the trial is, and what it is meant to tell you.",
    sections: [
      {
        paragraphs: [
          "Spinal cord stimulation uses mild electrical pulses, delivered through thin leads placed near the spinal cord, to change how pain signals are carried. It is one of the options for CRPS that has not responded to other treatment.",
        ],
      },
      {
        heading: "Why there is a trial first",
        paragraphs: [
          "Stimulation does not help everyone, and the only reliable way to know is to try it. During a trial, temporary leads are placed and connected to a small external device. The patient goes about daily life for a few days and notes what changes.",
        ],
      },
      {
        heading: "What counts as a good result",
        paragraphs: [
          "Doctor and patient look at the same questions: Is the pain meaningfully lower? Is sleep better? Can the limb be used more? If the answers are clearly yes, a permanent system can be discussed. If not, the leads are removed and other options are considered.",
          "Either outcome is useful. A trial that shows no benefit has saved the patient an operation that would not have helped.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "painkillers-and-your-kidneys",
    image: { src: "/images/blog/painkillers-and-your-kidneys.jpg", alt: "Blister packs of tablets" },
    title: "Painkillers and your kidneys: what long-term use means",
    field: "kidney",
    publishedAt: "2026-10-28T08:45:00+05:30",
    excerpt:
      "Anti-inflammatory painkillers are sold without prescription, which makes them easy to overuse. People with chronic pain should know what they ask of the kidneys.",
    sections: [
      {
        paragraphs: [
          "Non-steroidal anti-inflammatory drugs, known as NSAIDs, are among the most widely used medicines in the world. Taken occasionally by a healthy person they are generally safe. Chronic pain changes the picture, because the tablets are taken daily, for months.",
        ],
      },
      {
        heading: "How NSAIDs affect the kidneys",
        paragraphs: [
          "NSAIDs reduce substances the body uses to keep blood flowing through the kidneys. In people who are dehydrated, older, or who already have reduced kidney function, heart failure or high blood pressure, this can lower kidney function further.",
        ],
      },
      {
        heading: "Using them sensibly",
        paragraphs: [
          "Use the lowest dose that works, for the shortest time needed, and tell your doctor about every painkiller you take, including the ones bought over the counter. If you need them regularly, ask whether your kidney function should be checked.",
          "Regular use of NSAIDs is a reason to review the pain plan, not just to renew the tablets.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "paracetamol-and-the-liver",
    image: { src: "/images/blog/paracetamol-and-the-liver.jpg", alt: "Assorted tablets and capsules" },
    title: "Paracetamol and the liver: staying within the limit",
    field: "liver",
    publishedAt: "2026-10-19T19:20:00+05:30",
    excerpt:
      "Paracetamol is safe at the recommended dose and harmful above it. The risk for people in pain is taking it from several products at once.",
    sections: [
      {
        paragraphs: [
          "Paracetamol is often the first medicine suggested for pain, and for good reason: at the recommended dose it is well tolerated. The margin between a safe dose and a harmful one is narrower than many people assume.",
        ],
      },
      {
        heading: "Where the danger comes from",
        paragraphs: [
          "The liver clears paracetamol. When more is taken than the liver can process, a toxic by-product builds up and damages liver cells. This can happen from a single large overdose, or from taking a little too much every day.",
          "Many cold remedies and combination painkillers also contain paracetamol, so it is easy to exceed the limit without noticing.",
        ],
      },
      {
        heading: "Practical rules",
        paragraphs: [
          "Follow the dose on the label or the one your doctor gave you, check the ingredients of every product you take, and ask for advice if you drink alcohol regularly or have liver disease. If the recommended dose does not control your pain, the answer is a different plan, not more tablets.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "opioid-pain-medicines-and-breathing",
    image: { src: "/images/blog/opioid-pain-medicines-and-breathing.jpg", alt: "Glass medicine vials and ampoules" },
    title: "Opioid pain medicines and breathing during sleep",
    field: "lungs",
    publishedAt: "2026-10-09T10:00:00+05:30",
    excerpt:
      "Strong painkillers can slow breathing, particularly at night and when combined with sedatives. What patients and families should watch for.",
    sections: [
      {
        paragraphs: [
          "Opioids have a place in pain medicine, but they act on the same part of the brain that drives breathing. This is the most serious risk of the whole group, and it is the one patients hear least about.",
        ],
      },
      {
        heading: "Who is most at risk",
        paragraphs: [
          "The risk rises with higher doses, with a recent increase in dose, and when opioids are combined with alcohol, sleeping tablets or other sedating medicines. People with sleep apnoea or chronic lung disease need particular care.",
        ],
      },
      {
        heading: "Warning signs",
        paragraphs: [
          "Unusual drowsiness, slow or shallow breathing, loud snoring with pauses, and difficulty waking are all reasons to seek medical help urgently. Families should know these signs as well as the patient does.",
          "For CRPS in particular, opioids are considered a controversial option, and other treatments are usually tried first.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "mirror-therapy-and-graded-motor-imagery",
    image: { src: "/images/blog/mirror-therapy-and-graded-motor-imagery.jpg", alt: "Anatomical model of the human brain" },
    title: "Mirror therapy and graded motor imagery",
    field: "rehabilitation",
    publishedAt: "2026-09-30T16:40:00+05:30",
    excerpt:
      "Two rehabilitation techniques that work on the brain's picture of the painful limb, and how they are built up step by step.",
    sections: [
      {
        paragraphs: [
          "In CRPS the brain's map of the affected limb changes. Movements that should feel ordinary are expected to hurt, so they are avoided, and the limb stiffens. Graded motor imagery is a way of retraining that map without provoking pain.",
        ],
      },
      {
        heading: "Three stages",
        paragraphs: [
          "The first stage is recognising left and right: looking at pictures of hands or feet and deciding which side each one is. The second is imagining movements of the painful limb without making them. The third is mirror therapy.",
        ],
      },
      {
        heading: "How the mirror works",
        paragraphs: [
          "The painful limb is hidden behind a mirror and the healthy limb moves in front of it. The brain sees what looks like the painful limb moving freely and without pain.",
          "Progress is deliberately slow. Each stage is practised until it is comfortable before moving to the next, under the guidance of a therapist.",
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "chronic-pain-and-sleep",
    image: { src: "/images/blog/chronic-pain-and-sleep.jpg", alt: "A cat asleep under a white duvet" },
    title: "Chronic pain and sleep: a two-way street",
    field: "pain",
    publishedAt: "2026-09-18T21:10:00+05:30",
    excerpt:
      "Pain disturbs sleep, and poor sleep makes pain worse the next day. Breaking the cycle is part of treatment, not an extra.",
    sections: [
      {
        paragraphs: [
          "Ask anyone with chronic pain how they sleep and the answer is rarely good. What is less well known is that the relationship runs in both directions.",
        ],
      },
      {
        heading: "How each feeds the other",
        paragraphs: [
          "Pain makes it hard to fall asleep and causes repeated waking. In turn, a short or broken night lowers the threshold at which the body feels pain, so the next day hurts more.",
        ],
      },
      {
        heading: "What helps",
        paragraphs: [
          "Regular sleep and wake times, daylight and gentle activity during the day, and a pain plan that covers the night as well as the day all help. Some pain medicines also improve sleep; others disturb it, which is worth discussing with your doctor.",
          "When sleep improves, patients often find that pain becomes easier to manage even before anything else has changed.",
        ],
      },
    ],
    sample: true,
  },
];
