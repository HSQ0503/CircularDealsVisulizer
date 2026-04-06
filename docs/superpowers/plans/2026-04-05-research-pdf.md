# Research Paper PDF Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate an academically-formatted PDF of the research paper by rendering the existing `/research` page with Puppeteer and applying print-specific CSS.

**Architecture:** A standalone Node script (`scripts/generate-pdf.ts`) starts the Next.js dev server, opens `/research` in headless Puppeteer, injects a cover page + TOC + academic stylesheet into the DOM, then prints to PDF. A separate CSS file (`styles/research-print.css`) contains all academic overrides. The existing MDX rendering pipeline (async server components pulling from Supabase) is reused as-is.

**Tech Stack:** Puppeteer (dev dep), tsx (already installed), Next.js dev server

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Create | `scripts/generate-pdf.ts` | Main script: start server, puppeteer render, inject DOM, save PDF |
| Create | `styles/research-print.css` | Academic print stylesheet (Times New Roman, white bg, no colors) |
| Modify | `.gitignore` | Add `/output` directory |
| Create | `output/` | PDF output directory (gitignored) |

---

### Task 1: Install Puppeteer and Set Up Output Directory

**Files:**
- Modify: `package.json` (add puppeteer dev dependency)
- Modify: `.gitignore` (add `/output`)

- [ ] **Step 1: Install puppeteer**

```bash
cd C:/Dev/CircularDealsVisulizer && npm install --save-dev puppeteer
```

- [ ] **Step 2: Add `/output` to .gitignore**

Add this line to `.gitignore` after the `/out/` line:

```
/output
```

- [ ] **Step 3: Create scripts and output directories**

```bash
mkdir -p scripts output
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add puppeteer dev dependency and gitignore output dir"
```

---

### Task 2: Create the Academic Print Stylesheet

**Files:**
- Create: `styles/research-print.css`

This stylesheet overrides the existing web research styles for PDF output. It forces Times New Roman, white background, black text, hides navigation, and formats tables for print.

- [ ] **Step 1: Create the styles directory**

```bash
mkdir -p C:/Dev/CircularDealsVisulizer/styles
```

- [ ] **Step 2: Write the print stylesheet**

Create `styles/research-print.css` with the following content:

```css
/*
 * Academic Print Stylesheet for Research Paper PDF
 * Applied by generate-pdf.ts via Puppeteer style injection.
 * Overrides globals.css research-* classes for print output.
 */

/* ── Force light/academic colors on all CSS variables ── */
:root,
[data-theme="dark"] {
  --research-bg: #ffffff;
  --research-bg-alt: #ffffff;
  --research-surface: #ffffff;
  --research-surface-hover: #ffffff;
  --research-surface-2: #f9f9f9;
  --research-text: #000000;
  --research-text-secondary: #000000;
  --research-text-muted: #333333;
  --research-text-faint: #555555;
  --research-border: #000000;
  --research-border-subtle: #999999;
  --research-accent: #000000;
  --research-accent-muted: #000000;
  --research-link: #000000;
  --research-link-hover: #000000;
  --research-success: #000000;
  --research-warning: #000000;
  --research-callout-bg: #f5f5f5;
  --research-callout-border: #000000;
  --research-table-header-bg: #f0f0f0;
  --research-table-row-alt: #ffffff;
  --research-code-bg: #f5f5f5;
}

/* ── Base page styles ── */
body, .research-page {
  background: #ffffff !important;
  color: #000000 !important;
  font-family: "Times New Roman", Times, serif !important;
  font-size: 12pt !important;
  line-height: 1.5 !important;
}

/* ── Remove max-width constraint so content fills the page ── */
main {
  max-width: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

article {
  max-width: none !important;
}

/* ── Hide web-only elements ── */
.research-header,
.research-explorer,
.research-footer,
.research-nav-link,
.research-theme-toggle,
.research-back-link {
  display: none !important;
}

/* ── Hide original title block (replaced by injected cover page) ── */
.research-title-block {
  display: none !important;
}

/* ── Hide original abstract (moved to cover page) ── */
.research-abstract {
  display: none !important;
}

/* ── Typography: Times New Roman everywhere ── */
.research-prose,
.research-abstract-text,
.research-callout-text,
.research-list,
.research-reference,
.research-citation-box,
.research-keywords {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 12pt !important;
  line-height: 1.5 !important;
  color: #000000 !important;
}

.research-prose p {
  text-align: justify;
  text-indent: 0;
  margin-bottom: 0.8em;
}

/* ── Headings ── */
.research-h1 {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 18pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
  text-align: center;
}

.research-h1-subtitle {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 14pt !important;
  font-weight: 400 !important;
  color: #000000 !important;
  text-align: center;
}

.research-h2 {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 14pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
  margin-top: 1.5em !important;
  margin-bottom: 0.5em !important;
  padding-bottom: 0 !important;
  border-bottom: none !important;
}

.research-h3 {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 12pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
  margin-top: 1.2em !important;
  margin-bottom: 0.4em !important;
}

/* ── Sections ── */
.research-section {
  margin-bottom: 1.5em !important;
}

/* ── Callout boxes: simple bordered box ── */
.research-callout {
  background: #f5f5f5 !important;
  border-left: 2pt solid #000000 !important;
  border-radius: 0 !important;
  padding: 0.75em 1em !important;
  margin: 1em 0 !important;
}

.research-callout-label {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Definition boxes ── */
.research-definition {
  background: #f9f9f9 !important;
  border: 1pt solid #999999 !important;
  border-radius: 0 !important;
  padding: 0.75em 1em !important;
  margin: 1em 0 !important;
}

.research-definition-title {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
}

.research-formula {
  font-family: "Courier New", Courier, monospace !important;
  font-size: 11pt !important;
  color: #000000 !important;
}

.research-definition-note,
.research-definition-item-title,
.research-definition-item-text,
.research-definition-item-note {
  font-family: "Times New Roman", Times, serif !important;
  color: #000000 !important;
}

.research-definition-item-title {
  font-size: 11pt !important;
  font-weight: 700 !important;
}

.research-definition-item-text {
  font-size: 11pt !important;
}

.research-definition-item-note {
  font-size: 10pt !important;
  color: #333333 !important;
}

/* ── Tables: clean academic formatting ── */
.research-table-wrapper {
  background: #ffffff !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0.5em 0 !important;
  margin: 1em 0 !important;
}

.research-table-caption {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  margin-bottom: 0.5em !important;
}

.research-table {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  border-collapse: collapse !important;
  width: 100% !important;
}

.research-table th {
  font-weight: 700 !important;
  color: #000000 !important;
  padding: 0.4em 0.6em !important;
  border-top: 2pt solid #000000 !important;
  border-bottom: 1pt solid #000000 !important;
  background: #ffffff !important;
}

.research-table td {
  color: #000000 !important;
  padding: 0.3em 0.6em !important;
  border-bottom: 0.5pt solid #cccccc !important;
}

.research-table tbody tr:last-child td {
  border-bottom: 2pt solid #000000 !important;
}

.research-table-mono {
  font-family: "Courier New", Courier, monospace !important;
  font-size: 10pt !important;
}

.research-table-note {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 9pt !important;
  color: #333333 !important;
}

/* ── Score colors: all black in print ── */
.research-score-high,
.research-score-medium,
.research-score-low {
  color: #000000 !important;
}

/* ── Code blocks ── */
.research-code {
  background: #f5f5f5 !important;
  border: 0.5pt solid #999999 !important;
  border-radius: 0 !important;
  font-family: "Courier New", Courier, monospace !important;
  font-size: 9pt !important;
  color: #000000 !important;
}

.research-code-comment {
  color: #555555 !important;
}

.research-code-number {
  color: #000000 !important;
}

/* ── Lists ── */
.research-list {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 12pt !important;
  color: #000000 !important;
}

.research-list strong {
  color: #000000 !important;
}

/* ── References ── */
.research-references {
  border-top: 1pt solid #000000 !important;
}

.research-reference {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  color: #000000 !important;
  line-height: 1.4 !important;
}

/* ── Citation ── */
.research-citation {
  border-top: 1pt solid #000000 !important;
}

.research-citation-label {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
}

.research-citation-box {
  background: #f5f5f5 !important;
  border: 0.5pt solid #999999 !important;
  border-radius: 0 !important;
  font-family: "Times New Roman", Times, serif !important;
  font-size: 10pt !important;
  color: #000000 !important;
}

.research-bibtex-label {
  font-family: "Times New Roman", Times, serif !important;
  font-size: 9pt !important;
  color: #333333 !important;
}

.research-bibtex {
  background: #f5f5f5 !important;
  border: 0.5pt solid #999999 !important;
  border-radius: 0 !important;
  font-family: "Courier New", Courier, monospace !important;
  font-size: 8pt !important;
  color: #000000 !important;
}

/* ── Labels ── */
.research-label,
.research-paper-label {
  font-family: "Times New Roman", Times, serif !important;
  color: #000000 !important;
}

.research-authors-name {
  font-family: "Times New Roman", Times, serif !important;
  color: #000000 !important;
}

/* ── Keywords ── */
.research-keywords strong {
  color: #000000 !important;
}

/* ── Injected Cover Page ── */
.pdf-cover-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  font-family: "Times New Roman", Times, serif;
  page-break-after: always;
}

.pdf-cover-page h1 {
  font-size: 22pt;
  font-weight: 700;
  margin-bottom: 0.5em;
  line-height: 1.3;
}

.pdf-cover-page .pdf-cover-subtitle {
  font-size: 14pt;
  font-weight: 400;
  color: #333333;
  margin-bottom: 2em;
}

.pdf-cover-page .pdf-cover-label {
  font-size: 11pt;
  font-weight: 400;
  color: #555555;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 2em;
}

.pdf-cover-page .pdf-cover-author {
  font-size: 14pt;
  margin-bottom: 0.3em;
}

.pdf-cover-page .pdf-cover-email {
  font-size: 11pt;
  color: #333333;
  margin-bottom: 2em;
}

.pdf-cover-page .pdf-cover-date {
  font-size: 11pt;
  color: #555555;
}

.pdf-cover-abstract {
  text-align: left;
  max-width: 36em;
  margin: 2em auto 0;
  padding-top: 1.5em;
  border-top: 1pt solid #000000;
}

.pdf-cover-abstract h2 {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  font-weight: 700;
  margin-bottom: 0.5em;
}

.pdf-cover-abstract p {
  font-family: "Times New Roman", Times, serif;
  font-size: 11pt;
  line-height: 1.5;
  text-align: justify;
}

.pdf-cover-abstract .pdf-cover-keywords {
  font-size: 10pt;
  margin-top: 1em;
  color: #333333;
}

/* ── Injected Table of Contents ── */
.pdf-toc {
  font-family: "Times New Roman", Times, serif;
  page-break-after: always;
  padding-top: 2em;
}

.pdf-toc h2 {
  font-family: "Times New Roman", Times, serif;
  font-size: 16pt;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5em;
}

.pdf-toc-entry {
  display: block;
  font-size: 12pt;
  line-height: 2;
  color: #000000;
  text-decoration: none;
}

.pdf-toc-entry.pdf-toc-h3 {
  padding-left: 1.5em;
  font-size: 11pt;
  color: #333333;
}

/* ── Page break helpers ── */
.pdf-page-break {
  page-break-after: always;
}

/* ── Prevent awkward page breaks inside elements ── */
.research-table-wrapper,
.research-callout,
.research-definition {
  page-break-inside: avoid;
}

.research-h2,
.research-h3 {
  page-break-after: avoid;
}
```

- [ ] **Step 3: Commit**

```bash
git add styles/research-print.css
git commit -m "feat: add academic print stylesheet for PDF generation"
```

---

### Task 3: Create the PDF Generation Script

**Files:**
- Create: `scripts/generate-pdf.ts`

This is the main script. It starts the Next.js dev server, waits for it to be ready, opens the page with Puppeteer, injects the cover page, TOC, and print stylesheet, then generates the PDF.

- [ ] **Step 1: Write the script**

Create `scripts/generate-pdf.ts` with the following content:

```typescript
import { execSync, spawn, type ChildProcess } from 'child_process';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';

const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'output');
const OUTPUT_FILE = join(OUTPUT_DIR, 'research-paper.pdf');
const PRINT_CSS_PATH = join(ROOT, 'styles', 'research-print.css');

// ── Port selection ──────────────────────────────────────────────
function getRandomPort(): number {
  return 3100 + Math.floor(Math.random() * 900); // 3100-3999
}

// ── Wait for dev server to be ready ─────────────────────────────
async function waitForServer(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs / 1000}s`);
}

// ── Extract abstract text from the rendered page ────────────────
async function getAbstractText(page: puppeteer.Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.querySelector('.research-abstract-text');
    return el?.textContent?.trim() ?? '';
  });
}

// ── Extract keywords from the rendered page ─────────────────────
async function getKeywordsText(page: puppeteer.Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.querySelector('.research-keywords');
    return el?.textContent?.trim() ?? '';
  });
}

// ── Build cover page HTML ───────────────────────────────────────
function buildCoverPageHTML(abstractText: string, keywordsText: string): string {
  return `
    <div class="pdf-cover-page">
      <div class="pdf-cover-label">Working Paper</div>
      <h1>Quantifying Circularity in AI Industry Deal Networks</h1>
      <div class="pdf-cover-subtitle">A Graph-Based Analysis of Investment and Service Flows</div>
      <div class="pdf-cover-author">Shouqi Han</div>
      <div class="pdf-cover-email">hsq0503@gmail.com</div>
      <div class="pdf-cover-date">January 2026</div>
      <div class="pdf-cover-abstract">
        <h2>Abstract</h2>
        <p>${abstractText}</p>
        <p class="pdf-cover-keywords">${keywordsText}</p>
      </div>
    </div>
  `;
}

// ── Build TOC from headings on the page ─────────────────────────
async function buildTOCHTML(page: puppeteer.Page): Promise<string> {
  const headings = await page.evaluate(() => {
    const results: { tag: string; text: string }[] = [];
    // Only get headings inside research-section and research-references
    const sections = document.querySelectorAll('.research-section, .research-references');
    sections.forEach(section => {
      section.querySelectorAll('h2, h3').forEach(el => {
        results.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim() ?? '',
        });
      });
    });
    return results;
  });

  // Also add "References" if not captured
  const hasReferences = headings.some(h => h.text.toLowerCase().includes('references'));
  if (!hasReferences) {
    headings.push({ tag: 'h2', text: 'References' });
  }

  const entries = headings.map(h => {
    const cls = h.tag === 'h3' ? 'pdf-toc-entry pdf-toc-h3' : 'pdf-toc-entry';
    return `<span class="${cls}">${h.text}</span>`;
  }).join('\n');

  return `
    <div class="pdf-toc">
      <h2>Table of Contents</h2>
      ${entries}
    </div>
  `;
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const port = getRandomPort();
  const baseUrl = `http://localhost:${port}`;
  let server: ChildProcess | null = null;

  try {
    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Read the print stylesheet
    const printCSS = readFileSync(PRINT_CSS_PATH, 'utf-8');

    // Start Next.js dev server
    console.log(`Starting Next.js dev server on port ${port}...`);
    server = spawn('npx', ['next', 'dev', '--port', String(port)], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    server.stdout?.on('data', (data: Buffer) => {
      const line = data.toString().trim();
      if (line) console.log(`  [next] ${line}`);
    });

    server.stderr?.on('data', (data: Buffer) => {
      const line = data.toString().trim();
      if (line && !line.includes('ExperimentalWarning')) {
        console.log(`  [next] ${line}`);
      }
    });

    // Wait for server
    console.log('Waiting for server to be ready...');
    await waitForServer(`${baseUrl}/research`, 60_000);
    console.log('Server is ready.');

    // Launch Puppeteer
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the research page
    console.log('Loading /research...');
    await page.goto(`${baseUrl}/research`, {
      waitUntil: 'networkidle0',
      timeout: 60_000,
    });

    // Wait a moment for any client-side hydration
    await new Promise(r => setTimeout(r, 2000));

    // Extract abstract and keywords before hiding them
    console.log('Extracting abstract and keywords...');
    const abstractText = await getAbstractText(page);
    const keywordsText = await getKeywordsText(page);

    // Build injected elements
    const coverHTML = buildCoverPageHTML(abstractText, keywordsText);
    const tocHTML = await buildTOCHTML(page);

    // Inject cover page and TOC at the top of <main>, then inject print CSS
    console.log('Injecting cover page, TOC, and print styles...');
    await page.evaluate((cover: string, toc: string, css: string) => {
      // Inject print CSS
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);

      // Inject cover page and TOC before the article
      const main = document.querySelector('main');
      if (main) {
        main.insertAdjacentHTML('afterbegin', toc);
        main.insertAdjacentHTML('afterbegin', cover);
      }
    }, coverHTML, tocHTML, printCSS);

    // Generate PDF
    console.log('Generating PDF...');
    await page.pdf({
      path: OUTPUT_FILE,
      format: 'Letter',
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
      },
      printBackground: false,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 10pt; font-family: 'Times New Roman', Times, serif; color: #000;">
          <span class="pageNumber"></span>
        </div>
      `,
    });

    console.log(`PDF saved to: ${OUTPUT_FILE}`);
    await browser.close();
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  } finally {
    // Kill the dev server
    if (server) {
      console.log('Shutting down dev server...');
      server.kill('SIGTERM');
      // On Windows, also try taskkill
      if (process.platform === 'win32' && server.pid) {
        try {
          execSync(`taskkill /pid ${server.pid} /T /F 2>nul`, { stdio: 'ignore' });
        } catch {
          // ignore
        }
      }
    }
  }
}

main();
```

- [ ] **Step 2: Test the script runs without errors**

```bash
cd C:/Dev/CircularDealsVisulizer && npx tsx scripts/generate-pdf.ts
```

Expected: The script starts the dev server, loads `/research`, injects the cover page/TOC/CSS, generates a PDF, and saves it to `output/research-paper.pdf`. The console should end with:

```
PDF saved to: C:\Dev\CircularDealsVisulizer\output\research-paper.pdf
Shutting down dev server...
```

- [ ] **Step 3: Open the PDF and verify**

Open `output/research-paper.pdf` and verify:
- Page 1: Cover page with title, subtitle, author, email, date, abstract
- Page 2: Table of contents listing all 7 sections + References
- Remaining pages: Full paper in Times New Roman, 12pt, white background
- Tables render with data (loop scores, hub scores, cycles, null model, sensitivity)
- No navigation elements (header, theme toggle, explorer buttons)
- Page numbers in footer

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-pdf.ts
git commit -m "feat: add PDF generation script for research paper"
```

---

### Task 4: Add npm Script and Final Verification

**Files:**
- Modify: `package.json` (add `generate-pdf` script)

- [ ] **Step 1: Add the npm script**

Add to `scripts` in `package.json`:

```json
"generate-pdf": "tsx scripts/generate-pdf.ts"
```

So the scripts section becomes:

```json
"scripts": {
  "dev": "next dev",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "eslint",
  "generate-pdf": "tsx scripts/generate-pdf.ts"
},
```

- [ ] **Step 2: Verify the npm script works**

```bash
cd C:/Dev/CircularDealsVisulizer && npm run generate-pdf
```

Expected: Same output as Task 3 Step 2. PDF saved to `output/research-paper.pdf`.

- [ ] **Step 3: Run build to verify no TypeScript breakage**

```bash
cd C:/Dev/CircularDealsVisulizer && npm run build
```

Expected: Build succeeds with zero errors.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add generate-pdf npm script"
```
