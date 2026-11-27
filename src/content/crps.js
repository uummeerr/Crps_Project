// Everything about CRPS, shown in the CRPS part of the Expertise page. The definition, types and Budapest
// criteria are the client's own text; the symptoms and questions are condensed
// from the fact sheet published on the previous site.

export const definition = {
  summary:
    "CRPS is a chronic pain condition, usually in a limb. The pain continues after an injury or with no clear trigger, and it is out of proportion in time and severity to what the original event would explain.",
  behaviour:
    "It typically starts distally and is not limited to one nerve or dermatome.",
  changes:
    "It comes with sensory, vasomotor, sudomotor/edema and motor/trophic changes.",
};

export const types = [
  {
    label: "Type I",
    title: "No confirmed nerve lesion",
    text: "Formerly called reflex sympathetic dystrophy.",
  },
  {
    label: "Type II",
    title: "Confirmed nerve injury",
    text: "A confirmed peripheral nerve injury. Formerly called causalgia.",
  },
  {
    label: "CRPS-NOS",
    title: "Not otherwise specified",
    text: "Partly meets the criteria, and no other diagnosis explains it better.",
  },
];

export const budapest = {
  intro:
    "The clinical criteria of the International Association for the Study of Pain (IASP). All three must be met.",
  criteria: [
    "Continuing pain that is out of proportion to any inciting event.",
    "Symptoms reported in at least 3 of the 4 categories, and signs seen at examination in at least 2 of them.",
    "No other diagnosis explains the signs and symptoms better.",
  ],
  categories: [
    { title: "Sensory", text: "Hyperalgesia or allodynia." },
    { title: "Vasomotor", text: "Temperature or skin-colour asymmetry." },
    { title: "Sudomotor / edema", text: "Edema or sweating asymmetry." },
    {
      title: "Motor / trophic",
      text: "Reduced range of motion, weakness, tremor, dystonia, or hair, nail or skin changes.",
    },
  ],
};

export const symptoms = [
  "Prolonged pain that may be constant, felt as burning, pins and needles, or as if the limb is being squeezed.",
  "Pain that can spread to the whole arm or leg, even when the injury was only to a finger or toe.",
  "Increased sensitivity, so that even light touch or contact is painful (allodynia).",
  "Changes in skin temperature, skin colour and swelling of the affected limb.",
  "Changes in skin texture, sweating pattern, and nail and hair growth.",
  "Stiff joints, reduced ability to move the affected part, tremor, or a fixed abnormal posture (dystonia).",
];

export const questions = [
  {
    q: "Who can get CRPS?",
    a: "Anyone. It can strike at any age and affects both men and women, although it is much more common in women. The average age of affected individuals is about 40. It is rare in the elderly and very rare in children under 10, but it is not uncommon in teenagers.",
  },
  {
    q: "What causes it?",
    a: "In more than 90 percent of cases the condition is triggered by a clear history of trauma or injury. The most common triggers are fractures, sprains and strains, soft tissue injury, limb immobilisation such as a cast, and surgical or medical procedures. CRPS is an abnormal response that magnifies the effects of the injury. Occasionally it develops without any known injury.",
  },
  {
    q: "How is it diagnosed?",
    a: "There is no single diagnostic test. Diagnosis is based on the medical history and on signs and symptoms that match the definition. Tests may be used to rule out other conditions, such as arthritis syndromes, Lyme disease, generalised muscle diseases, a clotted vein, or small nerve fibre polyneuropathies. MRI or triple-phase bone scans sometimes show changes characteristic of CRPS.",
  },
  {
    q: "What is the outlook?",
    a: "The outcome varies from person to person. Almost all children and teenagers have a good recovery. Some individuals are left with unremitting pain and irreversible changes despite treatment. Early treatment, particularly rehabilitation, is thought to help limit the disorder.",
  },
];

export const clinicView = {
  quote: "CRPS is in the brain and not in the limb.",
  text: "It is important for physicians to understand this: the pain will remain even if the limb is amputated. When physical trauma is associated with psychological trauma, the chances of CRPS go up significantly.",
};

export const sourceNote =
  "General information on this page is adapted from the CRPS fact sheet of the US National Institute of Neurological Disorders and Stroke (NINDS) and the IASP Budapest criteria. It is educational and does not replace a medical consultation.";
