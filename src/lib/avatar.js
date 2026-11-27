// The round photo shown as the logo in the menu bar and footer.
//
// To change it, save the doctor's portrait as
//   public/images/doctor-avatar.jpg   (.jpeg, .png and .webp also work)
// Until that file exists, the logo falls back to the portrait already used
// elsewhere on the site. This file reads the disk, so it only runs on the
// server; the result is passed to the menu bar as a prop.

import { existsSync } from "node:fs";
import { join } from "node:path";

const PREFERRED = ["doctor-avatar.jpg", "doctor-avatar.jpeg", "doctor-avatar.png", "doctor-avatar.webp"];
const FALLBACK = { src: "/images/Tariq_trumboo.jpg", position: "72% 26%" };

export function getAvatar() {
  const found = PREFERRED.find((name) => existsSync(join(process.cwd(), "public", "images", name)));
  // `position` keeps the face in the middle of the circle when cropping.
  return found ? { src: `/images/${found}`, position: "50% 12%" } : FALLBACK;
}
