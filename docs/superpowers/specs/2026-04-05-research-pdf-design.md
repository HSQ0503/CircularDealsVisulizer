# Research Paper PDF Generator

## Overview

A Node script (`scripts/generate-pdf.ts`) that generates an academically-formatted PDF of the research paper by launching the Next.js dev server, navigating Puppeteer to `/research`, applying academic print styles, and saving the rendered page as a PDF.

This reuses the existing MDX rendering pipeline — all async server components (`TotalDeals`, `LoopsTable`, `NullModelSection`, `HubScoreTable`, `CyclesTable`, `SensitivityLoopTable`, etc.) execute against the real database, so the PDF contains the same live data as the website.

## Cover Page

The first page of the PDF is a standalone cover page containing:

- **Title:** Quantifying Circularity in AI Industry Deal Networks
- **Subtitle:** A Graph-Based Analysis of Investment and Service Flows
- **Author:** Shouqi Han
- **Email:** hsq0503@gmail.com
- **Date:** Working Paper — January 2026
- **Abstract:** The full abstract text from the MDX

The cover page is followed by a page break.

## Table of Contents

A generated table of contents listing all sections with page numbers:

1. Introduction
2. Background and Related Work (with subsections 2.1–2.3)
3. Methodology (with subsections 3.1–3.7)
4. Results (with subsections 4.1–4.6)
5. Discussion (with subsections 5.1–5.4)
6. Limitations and Future Work (with subsections 6.1–6.5)
7. Conclusion
8. References

The TOC is followed by a page break.

## Academic Print Stylesheet

A print-only CSS file applied when generating the PDF. Overrides the web styles with:

### Typography
- Font: Times New Roman, 12pt body text
- Section headings (`h2`): 14pt bold, numbered
- Subsection headings (`h3`): 12pt bold, numbered
- Line height: 1.5 (standard for working papers)

### Layout
- Page size: US Letter (8.5 x 11 in)
- Margins: 1 inch on all sides
- Single-column layout
- Max width removed (fill the page)

### Colors
- White background, black text
- No colored score classes — all scores rendered in black monospace
- Table borders: thin solid black lines
- No background colors on table rows

### Tables
- Full-width within margins
- Thin borders, no colored backgrounds
- Caption above table, note below
- Monospace numbers preserved

### Page Numbers
- Centered in footer
- Cover page and TOC excluded from numbering (or numbered separately as i, ii)

## Elements Hidden in Print

The following elements from the web version are hidden via `display: none` in the print stylesheet:

- Header navigation (back link, theme toggle, interactive explorer link)
- Interactive Data Explorer section (the buttons linking to `/graph`)
- Site footer
- Any hover/interactive styling

The following elements are **kept**:
- Citation block and BibTeX (academic content)
- References section
- All tables, callouts, definitions, and formulas

## Cover Page and TOC Implementation

The current MDX has a title block (title, subtitle, author, date) and abstract, but no dedicated cover page or TOC. The script handles this by injecting HTML into the rendered DOM before printing:

1. **Cover page:** Puppeteer injects a cover page `<div>` at the top of `<main>` with the title, subtitle, author, email, date, and "Working Paper" label. The existing title block in the MDX body is hidden via print CSS to avoid duplication. A CSS `page-break-after: always` separates it.

2. **Table of contents:** Puppeteer reads all `h2` and `h3` elements from the rendered page, builds a TOC `<div>` with section numbers and titles, and injects it after the cover page. Page numbers are added via a second Puppeteer pass (generate PDF, read page numbers from the outline, regenerate with TOC page numbers filled in) OR the TOC omits page numbers and just lists sections — simpler and still academically acceptable for a working paper.

## Script: `scripts/generate-pdf.ts`

### Flow

1. Start the Next.js dev server on a random available port
2. Wait for the server to be ready (poll the health endpoint or `/research`)
3. Launch Puppeteer in headless mode
4. Navigate to `http://localhost:{port}/research`
5. Wait for the page to fully render (wait for network idle — all async server components must resolve)
6. Inject the cover page and TOC HTML into the DOM
7. Inject the academic print stylesheet
8. Call `page.pdf()` with settings:
   - Format: Letter
   - Margins: 1 inch all sides
   - Print background: false
   - Display header/footer with page numbers
9. Save to `output/research-paper.pdf`
10. Close browser, kill dev server, exit

### Error Handling

- If the dev server fails to start within 30 seconds, exit with error
- If Puppeteer fails to load the page, exit with error
- If the output directory doesn't exist, create it

## Dependencies

- `puppeteer` — added as a dev dependency

## Run Command

```bash
npx tsx scripts/generate-pdf.ts
```

Output: `output/research-paper.pdf`

## What This Does NOT Do

- No "Download PDF" button on the website
- No API route for PDF generation
- No CI/CD integration
- No LaTeX or Typst toolchain
