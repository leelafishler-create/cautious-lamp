[README.md](https://github.com/user-attachments/files/29398709/README.md)
# Curated Comedy in the Age of Algorithims

A JSON-driven reel preferences form with an editorial layout inspired by fifty coffees and a Pantone TCX color palette.

## Structure

| File | Purpose |
|------|---------|
| `data/site-config.json` | Site title, navigation, Pantone palette, layout |
| `data/form-config.json` | Form sections and field definitions |
| `data/schema.json` | JSON Schema for validating submitted preferences |
| `index.html` | Home page — goal, results, and CTA to the form |
| `form.html` | Reel preferences form and JSON output |
| `css/styles.css` | Editorial grid styling |
| `js/shared.js` | Shared layout helpers |
| `js/home.js` | Home page bootstrap |
| `js/form.js` | Form page bootstrap |

## Run locally

```bash
cd ~/curated-comedy
python3 -m http.server 8080
```

Open http://localhost:8080 in your browser.

## Pantone palette

- **Cloud Dancer** 11-4201 TCX — background
- **Cherry Tomato** 17-1563 TCX — accents & submit
- **Blue Atoll** 16-4535 TCX — navigation & focus
- **Sap Green** 13-0331 TCX — section accents
- **Bright Marigold** 15-1164 TCX — discovery section
