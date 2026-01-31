# Homepage Redesign Plan: Startup → Research Portal

## Executive Summary

The current homepage (`app/page.tsx`) uses a marketing-first approach with gradient backgrounds, animated elements, and promotional language typical of startup landing pages. This plan transforms it into a **credible research portal** that:

1. Establishes authority through restraint and academic presentation
2. Aligns visually with the journal-quality `/research` page
3. Maintains engagement through clear information hierarchy
4. Preserves the core value proposition: "Follow the money in AI"

**Core Shift:** From "selling the product" → "presenting the research"

---

## Credibility Audit

### Severity Scale
- **5 (Critical)**: Undermines credibility significantly
- **4 (High)**: Creates startup/marketing impression
- **3 (Medium)**: Stylistically inconsistent with academic tone
- **2 (Low)**: Minor polish needed
- **1 (Minimal)**: Acceptable but could improve

### Current Issues

| Element | Issue | Severity | Location |
|---------|-------|----------|----------|
| Background gradient | `radial-gradient(ellipse_at_top...)` creates marketing feel | **5** | Line 8 |
| "text-gradient" brand | Gradient text is promotional, not academic | **4** | Line 14, 34, etc. |
| Hero animation | `animate-slide-up` is startup-style flourish | **3** | Line 44 |
| "Explore the Graph" CTA | Button-heavy calls to action | **3** | Lines 56-62 |
| Emoji-like icons | Decorative colored circles in legend | **2** | Lines 216-232 |
| "$350 billion+" tagline | Marketing-style urgency language | **3** | Lines 64-66 |
| "The same dollars keep changing hands" | Slightly sensational phrasing | **3** | Line 51 |
| Animated graph preview | Attention-grabbing animation | **2** | Line 71 |
| Badge styling | `badge-investment`, colored badges feel promotional | **3** | Lines 242, 253-255 |
| "Featured Case Study" label | Marketing terminology | **2** | Line 239 |

### What Works (Keep)

| Element | Why It Works |
|---------|--------------|
| Core thesis | "Follow the money in AI" is clear and journalistic |
| The Pattern section | Step-by-step explanation is educational |
| The Scale section | Deal vs. Reality comparisons are substantive |
| Key Questions section | Raises legitimate analytical questions |
| Footer disclaimer | Appropriate academic hedging |

---

## Section-by-Section Recommendations

### 1. Global Page Wrapper

**Current:**
```tsx
<main className="min-h-screen">
  <div className="fixed inset-0 bg-[radial-gradient(...)]" />
```

**Recommended:**
```tsx
<main className="home-page min-h-screen">
  {/* Remove gradient entirely */}
```

**Changes:**
- Remove the decorative gradient background
- Add `home-page` class for CSS variable scoping (mirrors research page pattern)
- Use warm cream background in light mode (`#FFFDF8`)
- Simpler, cleaner dark mode (`#1a1a1e`)

---

### 2. Navigation Bar

**Current:** Gradient brand text, button-style CTA

**Recommended:**
- Replace `text-gradient` with solid charcoal (`#2c2c2c`)
- Change "Explore Graph" button to simple text link
- Add subtle bottom border (1px, `rgba(0,0,0,0.08)`)
- Consider adding: "About" | "Methodology" links (future)

**Visual:**
```
AI Bubble Map                     Case Studies  Research  Graph →
─────────────────────────────────────────────────────────────────
```

---

### 3. Hero Section

**Current:**
- Two-column layout with animated graph preview
- Marketing headline with slide-up animation
- Large CTA button with arrow icon

**Recommended:**

Option A: **Centered Academic Header**
```
                    AI Bubble Map

    Tracking capital flows between AI companies
    through investments, partnerships, and commitments

         Case Studies    Research    Explore Data
```

Option B: **Keep Two-Column but Restrain**
- Remove `animate-slide-up` animation
- Reduce headline size from `text-4xl md:text-5xl` to `text-3xl md:text-4xl`
- Replace button CTA with underlined text link
- Keep AnimatedGraphPreview (it demonstrates the tool)

**Recommended: Option B** - The graph preview adds value and differentiates from pure text sites.

**Specific Changes:**
- Remove animation class
- Tone down headline: "Mapping capital flows in AI" (less promotional)
- Subhead revision: Remove "The same dollars keep changing hands" (sensational)
- Replace button with: `Explore the data →` as text link
- Remove "$350 billion+" tagline or move to a data callout box

---

### 4. The Pattern Section (Lines 77-129)

**Current:** Good structure, but uses startup-style icon circles

**Recommended:**
- Keep the 3-step structure (it's educational)
- Replace colored icon circles with simple numbered markers or academic-style figures
- Add "Figure 1:" label pattern

**Visual Shift:**
```
FROM:  [🟢 icon]  A Invests in B
TO:    1.        A Invests in B
       ─────────────────────────
```

**Or use academic figure boxes:**
```
┌─────────────────────────────────────┐
│  Step 1: Investment                 │
│                                     │
│  Microsoft → OpenAI ($13B+)         │
└─────────────────────────────────────┘
```

---

### 5. The Scale Section (Lines 131-176)

**Current:** Comparison cards work well conceptually

**Recommended:**
- Restyle cards to match `.research-table` aesthetic
- Consider converting to actual table format
- More neutral labeling: "Reported" vs "Context" instead of "The Deal" vs "The Reality"

**Example Table Format:**
```
┌──────────────────────┬──────────────────────────┐
│ Reported             │ Context                  │
├──────────────────────┼──────────────────────────┤
│ Microsoft: $13B+     │ OpenAI 2024 Rev: ~$3.7B  │
│ OpenAI valued: $150B │ Multiple: 40x revenue    │
│ NVIDIA AI 2x growth  │ ~80% from few buyers     │
└──────────────────────┴──────────────────────────┘
```

---

### 6. Key Questions Section (Lines 178-208)

**Current:** This section is actually quite good and substantive

**Recommended:**
- Keep structure largely intact
- Restyle cards to match `.research-callout` from research page
- Consider adding citations or "See: [Research Page Section]" links
- Change `font-semibold` headers to serif font for academic feel

---

### 7. Flow Legend Section (Lines 211-234)

**Current:** Colored dots feel like UI chrome

**Recommended:**
- Convert to a simple key/legend box in academic style
- Position could be integrated into footer or as a sidebar reference

```
─────────────────────────────────────────
Flow Types: ● Money  ● Compute  ● Service  ● Equity
─────────────────────────────────────────
```

Or as a proper legend box:
```
┌─ Legend ────────────────────┐
│  ─── Money (investments)    │
│  ─── Compute (hardware)     │
│  ─── Service (cloud/SaaS)   │
│  ─── Equity (ownership)     │
└─────────────────────────────┘
```

---

### 8. Featured Case Study Section (Lines 236-268)

**Current:** Uses marketing badges and "Featured" label

**Recommended:**
- Rename: "Case Study" or "Example Analysis"
- Remove `badge-investment` colored badges
- Use monochrome tags or simple text list
- Restyle link as text with arrow, not button

**Before:**
```
[Featured]
The OpenAI ↔ Microsoft ↔ NVIDIA Triangle
[$13B+ Investment] [Azure Commitment] [GPU Supply]
[View This Case Study →]
```

**After:**
```
────────────────────────────────────────────
Example: The OpenAI–Microsoft–NVIDIA Triangle

Microsoft invests billions in OpenAI. OpenAI spends
it on Microsoft Azure and NVIDIA GPUs. NVIDIA sells
to Microsoft. The same money flows in circles.

Involves: Investment ($13B+), Cloud commitment,
GPU supply agreements

→ View analysis
────────────────────────────────────────────
```

---

### 9. Footer (Lines 270-276)

**Current:** Simple disclaimer - this is good

**Recommended:**
- Keep the disclaimer text
- Add subtle navigation links: Home | Case Studies | Research | Graph
- Consider adding: "Data current as of [date]" for credibility
- Match research page footer styling

---

## Visual System Alignment

### CSS Variables to Add

Extend `globals.css` to include homepage-specific tokens that align with research page:

```css
/* Homepage tokens (aligned with research page) */
.home-page {
  --home-bg: #FFFDF8;           /* Same warm cream */
  --home-text: #1a1a1a;
  --home-text-muted: #4a4a4a;
  --home-border: rgba(0,0,0,0.08);
  --home-surface: #ffffff;
  --home-accent: #2c5282;       /* Muted blue, not bright */
}

[data-theme="dark"] .home-page {
  --home-bg: #1a1a1e;
  --home-text: #e8e6e3;
  --home-text-muted: #a0a0a0;
  --home-border: rgba(255,255,255,0.08);
  --home-surface: #242428;
  --home-accent: #63b3ed;
}
```

### Typography Alignment

| Element | Current | Recommended |
|---------|---------|-------------|
| Brand/Logo | Gradient, bold | Solid charcoal, medium weight |
| Headlines | Sans-serif, large | Sans-serif, slightly smaller |
| Body text | Sans-serif | Serif (Charter) for prose sections |
| Cards | Sans-serif | Mix: serif body, sans headers |
| Links | Blue buttons | Underlined text links |

### Spacing

- Increase whitespace between sections (research page uses generous margins)
- Max-width containers: `42rem` for text-heavy sections (matches research)
- Card padding: `1.5rem` minimum

---

## Priority Roadmap

### Phase 1: Quick Wins (Low Effort, High Impact)

1. **Remove gradient background** (Line 8)
   - Just delete the div
   - Effort: 1 minute

2. **Replace text-gradient with solid color**
   - Find/replace `text-gradient` → `text-text font-semibold`
   - Effort: 2 minutes

3. **Remove animations**
   - Delete `animate-slide-up` and `animate-fade-in` classes
   - Effort: 1 minute

4. **Soften CTAs**
   - Replace `btn btn-primary` with `text-primary hover:underline`
   - Effort: 5 minutes

5. **Add ThemeToggle to nav**
   - Import and add ThemeToggle component
   - Effort: 2 minutes

### Phase 2: Structural Refinement (Medium Effort)

6. **Restyle section headers**
   - Add horizontal rules above/below
   - Use smaller, muted labels
   - Effort: 15 minutes

7. **Convert "The Scale" to table format**
   - Replace card grid with `.research-table` styled table
   - Effort: 20 minutes

8. **Restyle Key Questions as callout boxes**
   - Apply `.research-callout` pattern
   - Effort: 15 minutes

9. **Simplify Featured Case Study**
   - Remove badges, use text-based presentation
   - Effort: 10 minutes

10. **Add home-page CSS scope**
    - Create CSS variables in globals.css
    - Apply consistent colors
    - Effort: 20 minutes

### Phase 3: Polish (Higher Effort)

11. **Typography overhaul**
    - Add serif fonts for prose sections
    - Adjust line-heights and letter-spacing
    - Effort: 30 minutes

12. **Flow legend redesign**
    - Convert to academic-style key box
    - Effort: 15 minutes

13. **Navigation enhancement**
    - Add methodology/about links (if pages exist)
    - Restructure link hierarchy
    - Effort: 20 minutes

14. **Footer enhancement**
    - Add nav links
    - Add "last updated" date
    - Effort: 10 minutes

---

## Do Not Change List

These elements should remain unchanged:

| Element | Reason |
|---------|--------|
| `AnimatedGraphPreview` component | Core differentiator, demonstrates the tool |
| Graph page link destinations | Functional navigation |
| Case study URL structure | Maintains bookmarkable links |
| Footer disclaimer text | Legally appropriate hedging |
| Core thesis messaging | "Follow the money in AI" is strong |
| Three-step "Pattern" structure | Educationally effective |
| Deal comparison data points | Substantive content |
| Key questions content | Analytically valuable |
| Any components in `components/graph/*` | Out of scope per requirements |

---

## Implementation Checklist

When implementing, verify each phase:

```
Phase 1:
[ ] Gradient background removed
[ ] text-gradient replaced with solid color
[ ] Animations removed
[ ] CTAs softened to text links
[ ] ThemeToggle added to nav
[ ] npm run lint passes
[ ] npm run build passes
[ ] Visual check in browser (light mode)
[ ] Visual check in browser (dark mode)

Phase 2:
[ ] Section headers restyled
[ ] The Scale converted to table
[ ] Key Questions use callout styling
[ ] Case Study simplified
[ ] home-page CSS scope added
[ ] All lint/build checks pass
[ ] Visual verification complete

Phase 3:
[ ] Serif typography for prose
[ ] Flow legend redesigned
[ ] Navigation enhanced
[ ] Footer enhanced
[ ] Final visual review
[ ] Cross-browser check
```

---

## Summary

This plan transforms the homepage from a marketing-focused startup landing page to a credible research portal by:

1. **Removing visual noise**: Gradients, animations, and promotional styling
2. **Aligning with research page**: Consistent colors, typography, and spacing
3. **Emphasizing substance**: Let the content (deal data, questions, analysis) speak
4. **Maintaining engagement**: Keep the graph preview and clear navigation

The result should feel like arriving at a research publication's homepage rather than a SaaS product page.
