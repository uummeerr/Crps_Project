import { Figtree } from "next/font/google";
import "./globals.css";
import "./motion.css";
import "lenis/dist/lenis.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import ThemeDial from "@/components/ThemeDial";
import Intro from "@/components/chrome/Intro";
import ButtonLean from "@/components/chrome/ButtonLean";
import { site } from "@/content/site";
import { getAvatar } from "@/lib/avatar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}, ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_IN",
  },
};

export const viewport = {
  themeColor: "#f5faf8",
};

// Runs before the first paint: use the theme the visitor saved, else light.
// ThemeDial.js changes and saves it afterwards.
const themeScript = `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}})()`;

// Runs before the first paint: on the first page of a browser session, mark
// <html data-intro="play"> so the opening cover shows (Intro.js, motion.css).
// Skipped when the visitor has asked for reduced motion.
const introScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(!sessionStorage.getItem("intro")){sessionStorage.setItem("intro","1");document.documentElement.dataset.intro="play"}}catch(e){}})()`;

// Content is hidden until it is revealed on scroll. Without JavaScript nothing
// would reveal it, so this shows everything straight away.
const noScriptStyles =
  "[data-reveal],[data-stagger]>*{opacity:1!important}.words .w>span{translate:none!important}";

export default function RootLayout({ children }) {
  const avatar = getAvatar();

  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={figtree.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <noscript>
          <style>{noScriptStyles}</style>
        </noscript>
        <Intro />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav avatar={avatar} />
        <main id="main">{children}</main>
        <Footer avatar={avatar} />
        <ThemeDial />
        <Motion />
        <ButtonLean />
      </body>
    </html>
  );
}
