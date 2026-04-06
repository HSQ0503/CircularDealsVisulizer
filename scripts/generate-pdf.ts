import { execSync, spawn, type ChildProcess } from 'child_process';
import { readFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import puppeteer, { type Page } from 'puppeteer';

const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'output');
const OUTPUT_FILE = join(OUTPUT_DIR, 'research-paper.pdf');
const PRINT_CSS_PATH = join(ROOT, 'styles', 'research-print.css');
const LOCK_FILE = join(ROOT, '.next', 'dev', 'lock');

// ── Check if a server is already running ────────────────────────
async function checkExistingServer(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}/research`);
    return res.ok;
  } catch {
    return false;
  }
}

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
async function getAbstractText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.querySelector('.research-abstract-text');
    return el?.textContent?.trim() ?? '';
  });
}

// ── Extract keywords from the rendered page ─────────────────────
async function getKeywordsText(page: Page): Promise<string> {
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
async function buildTOCHTML(page: Page): Promise<string> {
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
  let port: number;
  let baseUrl: string;
  let server: ChildProcess | null = null;
  let usingExistingServer = false;

  try {
    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Read the print stylesheet
    const printCSS = readFileSync(PRINT_CSS_PATH, 'utf-8');

    // Check if dev server is already running on port 3000
    if (await checkExistingServer(3000)) {
      console.log('Found existing dev server on port 3000, using it.');
      port = 3000;
      usingExistingServer = true;
    } else {
      port = getRandomPort();

      // Remove stale lock file if it exists
      if (existsSync(LOCK_FILE)) {
        console.log('Removing stale .next/dev/lock file...');
        rmSync(LOCK_FILE, { force: true });
      }

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
      await waitForServer(`http://localhost:${port}/research`, 60_000);
      console.log('Server is ready.');
    }

    baseUrl = `http://localhost:${port}`;

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
    // Only kill the server if we started it
    if (server && !usingExistingServer) {
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
