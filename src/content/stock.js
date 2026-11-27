// Stock photos used as stand-ins until the clinic supplies its own. Each is
// shown on the site with a "Sample image" badge. Both licences require the
// credit below wherever the photo is published, so either replace the photo
// or keep the credit (the footer prints this list).

export const stock = {
  dalLake: {
    src: "/images/stock/dal-lake.jpg",
    alt: "Boats on Dal Lake in Srinagar with snow-covered mountains behind",
    credit: "Dal Lake, Srinagar, by Suhail Skindar Sofi",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Dal_Lake_Hazratbal_Srinagar.jpg",
  },
  scsXray: {
    src: "/images/stock/scs-xray.jpg",
    alt: "X-ray of the spine showing implanted spinal cord stimulator leads",
    credit: "Spinal cord stimulator X-ray by Mconnell",
    licence: "CC BY 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Anterior_thoracic_SCS.jpg",
  },
};

// Stock video clips cut together into the film behind the lower half of the
// home page (components/passage/Passage.js; made by
// scripts/build-passage-film.sh, which also uses the X-ray above). All four
// are from Pexels, whose licence allows free use and editing and does not
// require a credit; the footer credits them anyway. The scanner is a generic
// one, not Dr Tramboo's equipment.
export const footage = [
  { credit: "MRI scanner (two clips) by MART PRODUCTION", source: "https://www.pexels.com/video/mri-machine-used-for-diagnostic-7089596/" },
  { credit: "nerve network animation by Nicola Narracci", source: "https://www.pexels.com/video/abstract-neural-network-connections-animation-29184317/" },
  { credit: "fibre optic lights by Pachon in Motion", source: "https://www.pexels.com/video/vibrant-fiber-optic-light-display-32333921/" },
];
