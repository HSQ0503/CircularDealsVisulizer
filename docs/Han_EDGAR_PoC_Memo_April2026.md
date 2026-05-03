# SEC EDGAR and Yahoo Finance Proof of Concept

Applying Professor Yan's Data Source Recommendation to the AI Circular Deals Dataset

Shouqi Han, April 21, 2026

## 1. What I did

Following your suggestion to use SEC EDGAR and Yahoo Finance, I ran a small test on three deals from my paper. For each deal, I pulled the most recent SEC filing, extracted the disclosed amounts and accounting details, and compared them to what my original dataset records. I also pulled current market caps to put the numbers in context. The goal was to see how much the data quality improves with official filings, and where this approach hits limits.

## 2. The three deals I tested

I picked these three on purpose. They cover the main disclosure situations I would run into at scale: one where the counterparty is private (Microsoft and OpenAI), one with a mixed equity structure (Amazon and Anthropic), and one where both sides are public SEC filers (NVIDIA and CoreWeave).

## 3. What I found

| Deal | Original dataset | SEC disclosed | Source |
|---|---|---|---|
| Microsoft invests in OpenAI | $10B | $13B committed, $11.6B funded; about $135B fair value after the October 2025 restructure (26.79% stake) | Microsoft FY2026 Q1 10-Q; 8-K filed Oct 28, 2025 |
| Amazon invests in Anthropic | $8B | $16.0B carrying value as of September 30, 2025 | Amazon Q3 2025 10-Q |
| NVIDIA invests in CoreWeave | $2B | $2B equity at $87.20 per share, plus a separate $6.3B cloud capacity purchase commitment running through April 2032 | NVIDIA FY2026 Q3 10-Q; CoreWeave S-1; Master Services Agreement Exhibit 10-31 |

Current market caps (April 2026, Yahoo Finance): Microsoft $3.14T, Amazon $2.69T, NVIDIA $4.90T, CoreWeave $63.9B.

## 4. What worked

For every deal, SEC filings replaced news-based estimates with exact, legally disclosed numbers. The filings also provided accounting details (equity method, available for sale, equity warrants) that my current dataset does not track, but that change how the flows should be interpreted.

The NVIDIA and CoreWeave case was the most interesting. Because both companies file with the SEC, I could check both sides of the relationship. I found a $6.3B cloud capacity purchase commitment from NVIDIA to CoreWeave that my original paper missed entirely. This is notable because my paper's whole point is bidirectional circular flows, so missing an edge on my flagship case study shows how much more complete a proper pipeline can be.

## 5. What did not work

The Microsoft and OpenAI case shows the main limitation. Microsoft discloses its side in detail, but OpenAI is private, so there is no matching filing. Any cloud payments from OpenAI to Azure appear only as aggregated revenue figures, without being named specifically. The same pattern holds for Anthropic and AWS. A scaled pipeline will still need news sources and press releases to fill the private side gaps.

## 6. Questions I would welcome your perspective on

1. When only one side of a bilateral deal is a public filer, what is the standard convention in network research? Best estimate from news? A categorical flag? Exclusion?

2. Microsoft's OpenAI stake has a cost basis around $13B but a fair value around $135B. These measure different things and would produce different edge weights in my analysis. Is there a convention in your work for which to use?

3. This PoC addresses data quality for the deals already in my dataset. The deeper limitation is how the original sample of companies was selected. Defining a proper sampling frame for AI industry research involves judgment calls (what counts as an AI company, what deal sizes qualify, how to handle non-US players) where your guidance would be really valuable before I build anything larger.

## 7. Next steps

I have held off on rebuilding the dataset since the sampling frame question should probably be settled first. Happy to iterate on any of the above in whatever direction is most useful.

---

Sources: Microsoft Corp. 10-Q (period ending September 30, 2025); Microsoft Corp. 8-K dated October 28, 2025; Amazon.com Inc. 10-Q (period ending September 30, 2025); NVIDIA Corp. 10-Q (period ending October 26, 2025); CoreWeave Inc. S-1 Registration Statement; Master Services Agreement between CoreWeave and NVIDIA (Exhibit 10-31). Market capitalization figures from Yahoo Finance, April 2026.
