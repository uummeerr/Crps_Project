# Dr Tariq Tramboo — website

The personal website of Dr Tariq Ahmad Tramboo, a pain physician in Srinagar, Kashmir. It covers his work in chronic pain and Complex Regional Pain Syndrome, his procedure workshops for other physicians, a blog, and how to book a consultation.

Built with [Next.js](https://nextjs.org) 16 (App Router) and React 19.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/app/` | Pages (home, about, expertise, workshops, blog, contact), the sitemap and robots file, and the stylesheets |
| `src/components/` | Page sections and shared pieces (menu, footer, theme switch, scroll effects) |
| `src/content/` | All the text: the doctor's details, treatments, workshops, blog posts, sample figures |
| `src/lib/` | Helpers: blog loading, scroll measurement (GSAP), smooth scrolling (Lenis) |
| `public/images/` | Photos and the clinic film |
| `public/passage/` | Frames of the scroll film behind the lower half of the home page |
| `scripts/build-passage-film.sh` | Rebuilds those frames from the source clips |

Contact details, the menu and the site name are set once in `src/content/site.js`.

## Before launch

Some content is placeholder and is marked on the site with a "Sample" badge:

- the headline figures and patient testimonials in `src/content/proof.js`
- the stock photos and film footage listed in `src/content/stock.js` (their credits are printed in the footer)

## Motion and accessibility

Scroll animations, the scroll film and smooth scrolling all switch off when the visitor's device asks for reduced motion; the page then shows everything in its finished state. The scroll film also stays off when the visitor has turned on data saving.
