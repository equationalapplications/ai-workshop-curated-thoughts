# Design: Replace Stripe Demo with Acme Loyalty Calculator

**Date:** 2026-05-24  
**Scope:** Surgical swap — Act 3 + demo/ directory + one Act 1 sentence  
**Goal:** Remove Stripe secret key requirement. Make demo fully offline and self-verifiable.

---

## Problem

Current tutorial requires a Stripe test key to run the optional server verification step. The Node.js server, package.json, and .env add setup friction. The tutorial goal is learning Curated Thoughts — Stripe was incidental.

## Solution

Replace the Stripe domain with a fictional "Acme Corp Loyalty Calculator." Rules are invented and not on the internet — agent cannot hallucinate correct output. Verification is instant: `node calculator.js` outputs match expected values or they don't.

---

## Changes

### tutorial.md

**Act 1 — one sentence update:**
- Current: `"Write me a Stripe checkout controller."`
- Replace with: `"Implement the Acme loyalty calculator."`
- Rationale: removes Stripe reference that no longer connects to the demo.

**Act 2 — Prerequisites section:**
- Current: "Node.js 18+ installed (for the Stripe demo boilerplate)"
- Replace with: "Node.js 18+ installed (for running `calculator.js` in Act 3)"

**Act 3 — full section rewrites:**

*Confirm Indexing (~5 min):*
- Replace Stripe PDF references with `acme-loyalty-rules.md`

*Curate Wisdom Tier (~10 min):*
- Replace example wiki page names: "Acme Loyalty Tiers", "Acme Points Calculation Rules"

*Open Boilerplate Repo (~3 min):*
- New file tree:
  ```
  curated-thoughts-acme-demo/
  ├── calculator.js       ← stub — fill this with the agent
  └── documents/
      └── acme-loyalty-rules.md
  ```
- Remove all references to controllers/, server.js, package.json, .env.example

*Prompt Agent (~10 min):*
- New verbatim prompt: `"Use the curated-thoughts tool to look up the Acme Loyalty Points Specification in our memory. Write the implementation for calculatePoints using the exact multipliers, tier rules, and category caps from the document."`

*Code Review + Verify (~7 min):*
- Replace "open PDF side-by-side" with "run node calculator.js"
- Expected outputs become the verification criteria:
  - Test 1 (Silver, $100, Monday): 1500 points
  - Test 2 (Gold, $100, Tuesday): 2550 points
  - Test 3 (Bronze, $300, Electronics): 500 points (capped)
- Remove "Optional — run the server" block entirely (npm install, .env, curl command)

---

### demo/ directory

**Remove:**
- `controllers/payment.js`
- `server.js`
- `package.json`
- `.env.example`

**Add:**

`calculator.js` — stub with inline test assertions:
```js
function calculatePoints(amount, userTier, category, dayOfWeek, hasActiveSubscription) {
  // TODO: Use curated-thoughts MCP to retrieve the Acme Loyalty Points Specification,
  // then implement this function using the exact rules from the document.
  return 0;
}

// Verification — run: node calculator.js
// If agent implemented correctly, all three lines match expected values.
console.log("Test 1 (Silver, $100, Monday):", calculatePoints(100, 'Silver', 'Clothing', 'Monday', false));
// Expected: 1500

console.log("Test 2 (Gold, $100, Tuesday):", calculatePoints(100, 'Gold', 'Clothing', 'Tuesday', true));
// Expected: 2550

console.log("Test 3 (Bronze, $300, Electronics):", calculatePoints(300, 'Bronze', 'Electronics', 'Friday', false));
// Expected: 500
```

`documents/acme-loyalty-rules.md` — the spec the agent must retrieve:
```markdown
# Acme Loyalty Points Specification v2.1

## Base Rate
Every $1.00 spent equals 10 points.

## Tier Multipliers
- Bronze: 1x multiplier
- Silver: 1.5x multiplier
- Gold: 2.5x multiplier (requires active subscription — if no active subscription, treat as Silver)

## Category Exceptions
- Items in the "Electronics" category: maximum 500 points regardless of tier or multipliers

## Day Bonus
If the purchase is made on a Tuesday, add a flat 50-point bonus after all multipliers are applied.
```

**Update:** `demo/README.md` — reflect new structure, remove server/key instructions.

---

## Verification Criteria (Expected Test Outputs)

| Test | Inputs | Calculation | Expected |
|------|--------|-------------|----------|
| 1 | Silver, $100, Clothing, Monday | 100 × 10 × 1.5 = 1500 | 1500 |
| 2 | Gold, $100, Clothing, Tuesday (subscribed) | 100 × 10 × 2.5 + 50 = 2550 | 2550 |
| 3 | Bronze, $300, Electronics, Friday | 300 × 10 × 1 = 3000, capped at 500 | 500 |

---

## What Does NOT Change

- Act 1 architecture explanation (three-tier model, pipeline, ecosystem comparison)
- Act 2 install + configure flow (entirely unchanged)
- Act 3 timing (~40 min total — server section removed but verification step remains)
- MCP wiring instructions
- Prerequisites (Ollama, nomic-embed-text, VSCode/Cursor, binary download)
