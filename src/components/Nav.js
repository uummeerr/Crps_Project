"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/content/site";

// `avatar` is the round logo photo: { src, position }. See lib/avatar.js.
export default function Nav({ avatar }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const ctaRef = useRef(null);
  const close = () => setOpen(false);

  // While the mobile menu is open: close on outside tap, on Escape, and when
  // the window grows to the desktop layout.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event) {
      if (!navRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1021px)");
    function onResize(event) {
      if (event.matches) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  // The compact pill (see globals.css) is sized to the "Book a consultation"
  // button, so keep its width in a CSS variable as fonts load or resize.
  useEffect(() => {
    const cta = ctaRef.current;
    const navEl = navRef.current;
    if (!cta || !navEl) return;
    const measure = () => navEl.style.setProperty("--nav-cta-w", `${cta.offsetWidth}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  // A blog article keeps "Blog" highlighted in the menu.
  const isCurrent = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav ref={navRef} className={`nav${open ? " open" : ""}`} aria-label="Main">
      <div className="nav-shell">
        <Link className="brand" href="/" onClick={close} aria-label={`${site.name}, home`}>
          <span className="brand-mark">
            <Image src={avatar.src} alt="" width={44} height={44} style={{ objectPosition: avatar.position }} />
          </span>
          <span className="brand-text">
            {site.name}
            <small>{site.role}</small>
          </span>
        </Link>

        <div className="nav-menu" id="nav-menu" data-lenis-prevent>
          <div className="nav-links">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onClick={close}
              >
                {item.label}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <Link ref={ctaRef} className="nav-cta" href="/contact" onClick={close}>
              Book a consultation
              <span aria-hidden="true">
                <ArrowUpRight />
              </span>
            </Link>
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
