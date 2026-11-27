import Image from "next/image";
import Link from "next/link";
import { pages, site } from "@/content/site";
import { footage, stock } from "@/content/stock";

export default function Footer({ avatar }) {
  const half = Math.ceil(pages.length / 2);
  const columns = [pages.slice(0, half), pages.slice(half)];

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/" aria-label={`${site.name}, home`}>
              <span className="brand-mark">
                <Image src={avatar.src} alt="" width={44} height={44} style={{ objectPosition: avatar.position }} />
              </span>
              <span className="brand-text">
                {site.name}
                <small>{site.role}</small>
              </span>
            </Link>
            <p>{site.tagline}</p>
          </div>
          {columns.map((column, index) => (
            <div key={index}>
              <h3>{index === 0 ? "Explore" : "More"}</h3>
              <ul>
                {column.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={site.whatsappHref}>WhatsApp {site.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={site.twitter}>Twitter</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {site.name}, {site.city}
          </span>
          <span>Information on this site is educational and does not replace medical advice.</span>
        </div>
        <div className="footer-bottom" style={{ border: 0, paddingTop: 10 }}>
          <span>
            Sample photos:{" "}
            {Object.values(stock).map((photo, index) => (
              <span key={photo.src}>
                {index > 0 ? "; " : null}
                <a href={photo.source}>{photo.credit}</a> ({photo.licence})
              </span>
            ))}
            , via Wikimedia Commons.
          </span>
          <span>
            Film footage:{" "}
            {footage.map((clip, index) => (
              <span key={clip.source}>
                {index > 0 ? "; " : null}
                <a href={clip.source}>{clip.credit}</a>
              </span>
            ))}
            , via Pexels.
          </span>
        </div>
      </div>
    </footer>
  );
}
