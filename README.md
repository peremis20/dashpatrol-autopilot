# DashPatrol website

Static marketing site: plain HTML, CSS and JavaScript, no build step.

## Run locally
```
cd site
python3 -m http.server 8080
```
Then open http://localhost:8080

## Deploy
Point any static host at the `site` folder as the publish directory.

- **Netlify / Cloudflare Pages:** publish directory `site`, no build command. `_headers` (security and cache headers) and `404.html` are picked up automatically.
- **Hostinger:** upload the contents of `site` (including the hidden `.htaccess` file) into `public_html`. `.htaccess` sets HTTPS, security and cache headers and the 404 page.
- **Vercel / others:** same folder; copy the values from `_headers` into the host's header settings.

## Before launch
- Domain: canonical tags, `sitemap.xml` and `robots.txt` assume `https://dashpatrol.io`.
- Forms (Sign In, Start Free Trial, Forgot Password, Contact) are simulated and send nothing until connected to a backend.
- Pricing amounts and stats are placeholders from the design.
