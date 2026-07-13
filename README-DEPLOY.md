# ECDC Website — Deployment Guide

A fully static site: plain HTML, CSS, and vanilla JavaScript. No build step, no
frameworks, no server-side code. The only external request the site makes is the
Google Maps embed on `contact.html`.

## How to deploy (any static host)

Upload the **entire contents of this `site/` folder** (keeping the folder structure
exactly as-is) to your host's web root:

- **Shared hosting (cPanel, GoDaddy, Bluehost, etc.):** upload everything into
  `public_html/` via the File Manager or FTP.
- **Netlify:** drag-and-drop this folder onto https://app.netlify.com/drop — done.
- **Cloudflare Pages / GitHub Pages / Vercel:** point the project at this folder;
  no build command, output directory = this folder.
- **Amazon S3 + CloudFront:** sync the folder to the bucket, set `index.html` as
  the index document.

The structure that must be preserved:

```
site/
  index.html            services.html        portfolio.html
  hurricane-resistant.html   about.html       contact.html
  projects/  (3 case-study pages)
  assets/    (css / js / img)
  robots.txt sitemap.xml
```

Test after upload: visit `/`, `/portfolio.html` (try the filters and click a photo),
`/hurricane-resistant.html` (open an FAQ), and `/contact.html` on a phone.

## TODOs the owner must complete

Every one of these is also marked with an HTML comment containing `TODO` in the
source, so you can find them with a search for "TODO".

1. **Email address** — REMOVED per owner request. The email is no longer
   published anywhere (footers, contact page, and JSON-LD all cleaned).
   Inquiries come through the Formspree quote form on `contact.html`, which
   delivers to the owner's inbox. The form still collects the visitor's own
   email so you can reply.
2. **Form endpoint (Formspree ID)** — DONE. The quote form on `contact.html`
   posts to `https://formspree.io/f/maqrwdoq` and submissions are live.
3. **Testimonials** — DONE. The three quotes on `index.html` are real Google
   reviews (Proto Bloom, Asmaa Metwally, Marina Kryven) from the 4.9-rated
   Google Business listing.
4. **Headshot of Dr. Arafa** — DONE. Real photo in place on `about.html`
   (`assets/img/dr-arafa-headshot.jpg`, 735×1000, 100 KB).
5. **Domain** — DONE. The site's real domain is `ecdc-us.com`, which is already
   used throughout `sitemap.xml`, `robots.txt`, canonical tags, Open Graph tags,
   and JSON-LD. A `CNAME` file (contents: `ecdc-us.com`) and a `.nojekyll` file
   are included for GitHub Pages hosting with the custom domain.
6. **Business hours** — DONE. Mon–Fri, 9:00 AM – 5:00 PM.
7. **Case-study narratives** — the three pages in `projects/` are marked
   `TODO: owner review for accuracy`. Please read and correct any project detail.

License numbers (FL P.E. #PE51761 · CGC #CGC060863) are already in place in every
page footer.

## Imagery note

All stock/placeholder images have been removed. The homepage hero and the
custom-home section previously used stock photos of a luxury mansion (and one 3D
render) that were **not** ECDC's own work; these were replaced with real ECDC
project photos:
- Homepage hero is now the Chevron fuel station (real project). To swap it for a
  different real project later, replace `assets/img/home-custom-hero.jpg`
  (1920×731) — Señor Frog's or a coastal home would also work.
- The "Coastal Custom Home" case study and custom-home gallery tiles now use real
  coastal/beach homes (coastal white 3-story, elevated pilings home, elevated
  stilt home, covered pool/patio).
Every image on the site is now genuine ECDC work.

## Notes for future iterations

- `contact.html` contains a commented-out `<section id="booking-placeholder">`
  where a booking/scheduling widget can be slotted in later.
- All images are pre-optimized for the web (max 268 KB; thumbnails ~600px,
  full images ≤1500px). Source originals remain in `H:\ECDC MARKETING\Photos\`.
- The site works with JavaScript disabled: navigation, content, and the form
  remain usable (the gallery simply shows all items without filtering).
