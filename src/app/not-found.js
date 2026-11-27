import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageTransition from "@/components/chrome/PageTransition";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageTransition>
      <div className="notfound">
        <div className="aurora" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="dots" aria-hidden="true" />
        <div className="wrap">
          <span className="eyebrow plain">Error 404</span>
          <h1>
            Page <span className="serif">not found.</span>
          </h1>
          <p>The page you are looking for does not exist or has moved.</p>
          <Link className="btn btn-primary" href="/">
            Back to home
            <span className="btn-dot" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
