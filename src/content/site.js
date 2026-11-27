// Site-wide details. This is Dr Tramboo's own website, so the brand is his
// name. Every page reads contact info and navigation from here, so a change
// to the phone number or menu is made in one place.

export const site = {
  name: "Dr Tariq Tramboo",
  shortName: "Dr Tramboo",
  initials: "TT",
  role: "Pain physician",
  city: "Srinagar, Kashmir",
  url: "https://www.crps.com",
  tagline: "Pain physician in Srinagar, Kashmir, treating chronic pain with advanced neuromodulation.",
  description:
    "Dr Tariq Ahmad Tramboo, MBBS, MD, FIPP (USA), is a pain physician in Srinagar, Kashmir, treating chronic pain, including Complex Regional Pain Syndrome, with advanced neuromodulation.",
  // Where Dr Tramboo sees patients. Shown on the contact page only.
  practice: { name: "Relief Pain Clinic", location: "Srinagar, Kashmir, India" },
  phoneDisplay: "+91 97972 12222",
  phoneHref: "tel:+919797212222",
  whatsappHref: "https://wa.me/919797212222",
  email: "taria363@yahoo.com",
  twitter: "https://twitter.com/tariqtramboo",
};

// Links in the top menu. Contact is not listed here because the "Book a
// consultation" button beside the menu already goes to the contact page.
export const nav = [
  { href: "/about", label: "About" },
  { href: "/expertise", label: "Expertise" },
  { href: "/workshops", label: "Workshops" },
  { href: "/blog", label: "Blog" },
];

// Every page, for the footer and the sitemap.
export const pages = [...nav, { href: "/contact", label: "Contact" }];
