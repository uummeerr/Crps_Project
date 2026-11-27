import Link from "next/link";
import { ArrowDown, ChevronRight } from "lucide-react";
import Headline from "./Headline";

// Header at the top of every inner page: breadcrumb, large title, intro, and
// an optional "On this page" list of in-page links.
//   jump   [{ href: "#diagnosis", label: "Diagnosis" }, ...]
export default function PageHeader({ crumb, title, accent, intro, jump }) {
  const text = (
    <div>
      <nav className="crumbs" aria-label="Breadcrumb" data-load>
        <Link href="/">Home</Link>
        <ChevronRight aria-hidden="true" />
        <span aria-current="page">{crumb}</span>
      </nav>
      <h1 className="words" data-load>
        <Headline text={title} accent={accent} />
      </h1>
      {intro ? (
        <p className="lead" data-load style={{ "--d": "260ms" }}>
          {intro}
        </p>
      ) : null}
    </div>
  );

  return (
    <header className="page-head">
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="dots" aria-hidden="true" />
      <div className="wrap">
        {jump ? (
          <div className="page-head-row">
            {text}
            <nav className="jump" aria-label="On this page" data-load style={{ "--d": "380ms" }}>
              <small>On this page</small>
              {jump.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                  <ArrowDown aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        ) : (
          text
        )}
      </div>
    </header>
  );
}
