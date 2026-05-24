# Tutorial Design: Workshop — Architecting AI Memory with Curated Thoughts

**Date:** 2026-05-24  
**Format:** Live workshop (in-person / virtual)  
**Audience:** AI practitioners (already building AI apps)  
**Primary outcome:** Working local setup — app installed, vault configured, MCP wired into editor  
**Duration:** 90–120 min  
**Structure:** Three-Act

---

## Prerequisites (attendees complete before workshop)

- Ollama installed and running locally
- `nomic-embed-text` model pulled: `ollama pull nomic-embed-text`
- VSCode or Cursor installed
- Curated Thoughts binary downloaded from GitHub Releases (install happens live in Act 2)
- Node.js 18+ (for the Stripe demo boilerplate)
- OS: macOS, Linux, or Windows (macOS tested most; note any known platform caveats)

---

## Act 1: Why This Exists + How It Works (~20 min)

### 1.1 Hook — The Hallucination Problem (3 min)

Open with the concrete failure mode: an agent writes a Stripe checkout controller from memory and produces an invalid payload (wrong parameter names, missing required fields). AI practitioners already know this pain. This is the "why we're here."

### 1.2 Three-Tier Memory Model (8 min)

Introduce the architecture with one diagram and concrete examples per tier:

| Tier | Name | What goes here | Mutability |
|------|------|----------------|------------|
| 1 | Facts | PDFs, API specs, immutable source docs | Immutable — never written by app |
| 2 | Wisdom | AI-synthesized wiki pages, architectural summaries | Living — approved by human |
| 3 | Working | Local code repositories watched by AST parser | Ephemeral — indexed on change |

Key insight: tiers compose. Agent retrieves from all three simultaneously via one MCP query.

### 1.3 Ecosystem Comparison (5 min)

Kept intentionally brief — these are "why not X" answers for practitioners who'll ask:

- **CodeGraph:** AST sibling. Both use Tree-sitter for structural code graphs without LLM calls. Curated Thoughts fuses this with document retrieval; CodeGraph is code-only.
- **GBrain:** Regex-based Markdown linker, no LLMs. CT uses Active Librarian for synthesis. Different trade-off: CT needs a local model; GBrain is fully deterministic.
- **Open Brain / OB1:** Cloud-first, Supabase-backed, remote HTTP/SSE. CT is fiercely local — stdio MCP, SQLite, Rust backend. Trust boundary stays on your machine.

### 1.4 Pipeline Overview (4 min)

Diagram or walkthrough of the ingestion pipeline:

```
watch files → convert (PDF/DOCX → markdown) → chunk → embed → store in SQLite
     → Active Librarian proposes wiki pages → human approves → wiki/ written
     → MCP query → retrieval facade (semantic + keyword) → agent context
```

---

## Act 2: Install + Configure (~40 min)

**Milestone: every attendee's editor has `curated-thoughts` wired as MCP by end of act.**

### 2.1 Install Binary (8 min)

- Download from GitHub Releases: `https://github.com/equationalapplications/curated-thoughts/releases`
- **macOS:** drag to Applications, approve in System Preferences → Security & Privacy
- **Linux:** `chmod +x`, move to `/usr/local/bin` or similar
- **Windows:** run `.msi` installer
- First launch: Setup Wizard — walk through it live

### 2.2 Vault Setup (12 min)

- Create vault folder (anywhere on filesystem)
- The app watches `documents/` inside the vault automatically
- Drop pre-prepared Stripe PDFs into `documents/stripe/` (facilitator distributes ZIP before workshop)
- Watch indexing status indicator in app UI — explain chunk → embed pipeline visually
- **Why now:** indexing takes time; starting in Act 2 means it's complete before Act 3 demo
- Show `.brain/` directory created by app (SQLite DB, converted shadows, metadata)

### 2.3 Ollama Model Check (5 min)

- `ollama list` in terminal — confirm `nomic-embed-text` present
- If missing: `ollama pull nomic-embed-text` (may take a few minutes on slow connections)
- App's Setup Status panel — all indicators green = ready

### 2.4 MCP Configuration (10 min)

- App Settings → copy auto-generated MCP JSON snippet
- **VSCode Copilot:** paste into `.vscode/mcp.json` or user `settings.json`
- **Cursor:** paste into `.cursor/mcp.json`
- Restart editor
- Open agent chat, confirm `curated-thoughts` tool appears in available tools list
- **Checkpoint:** attendees type a test query (e.g., "use curated-thoughts to search for anything") and confirm the tool is called

### 2.5 Room Checkpoint (5 min)

Presenter walks room (or asks for raises/emoji in virtual). Everyone connected before Act 3.

---

## Act 3: Stripe Demo (~40 min)

**Milestone: attendees prompt an agent that retrieves from local memory and writes correct, spec-grounded Stripe code.**

### 3.1 Ingest Stripe Docs (5 min)

Drop the two Stripe documents into `documents/stripe/`:

- `stripe-node-quickstart.pdf` — [Stripe: Build a checkout page with Payment Intents API](https://docs.stripe.com/payments/quickstart?lang=node)
- `stripe-checkout-session-api.pdf` — [Stripe API Reference: Create a Checkout Session](https://docs.stripe.com/api/checkout/sessions/create)

Watch indexing complete in app UI. Both docs now in Facts Tier.

### 3.2 Review Queue — Wisdom Tier (10 min)

- Open Review Queue tab
- Active Librarian has proposed wiki pages (e.g., "Stripe Checkout Integration Rules", "Required Payload Structures")
- Attendees approve one proposed page
- Navigate to `wiki/` tab — open the approved page
- **Key talking point:** The LLM didn't just store bytes. It read the PDFs and wrote a living, readable architectural guide. The agent will now retrieve both raw facts and synthesized wisdom.

### 3.3 Open Boilerplate Repo (3 min)

Distribute starter ZIP / repo link. Structure:

```
/curated-thoughts-stripe-demo
├── /controllers
│   └── payment.js       ← empty TODO stub
├── /documents
│   └── /stripe
│       ├── stripe-node-quickstart.pdf
│       └── stripe-checkout-session-api.pdf
├── server.js
├── package.json
└── .env.example
```

Open `controllers/payment.js` in editor — show the empty stub attendees will fill.

### 3.4 Prompting + Synthesis (10 min)

Open VSCode/Cursor agent chat. Run this prompt verbatim:

> "Use the curated-thoughts tool to look up the Stripe API specs in our memory. Write the implementation for the `createCheckoutSession` controller using the exact required payload structure from the documentation."

Guide attendees to watch:
- Agent invokes `curated-thoughts` MCP tool
- Query hits local SQLite, retrieves chunks from Stripe PDFs
- Agent reads chunks before writing code (not from training memory)
- Accept generated code, save file

### 3.5 Code Review + Verify (7 min)

- Open `payment.js` side-by-side with Stripe API PDF
- Verify: `line_items`, `mode`, `success_url` match strict spec requirements
- Optional: `npm install && npm start` + test POST for attendees with Stripe test keys

### 3.6 Closing (5 min)

What to do next:
- Add your own API specs, architecture docs, runbooks to `documents/`
- Connect a local code repository as Working Tier
- Use the MCP from any agent: Claude Code, Cursor, VSCode Copilot, Cline

Resources:
- [GitHub repo](https://github.com/equationalapplications/curated-thoughts)
- [`@equationalapplications/react-llm-wiki`](https://www.npmjs.com/package/@equationalapplications/react-llm-wiki)

---

## Timing Summary

| Act | Content | Duration |
|-----|---------|----------|
| Pre-workshop | Prerequisites, download binary | Before |
| Act 1 | Hook + Architecture | 20 min |
| Act 2 | Install + Vault + MCP | 40 min |
| Act 3 | Stripe Demo | 40 min |
| Buffer | Q&A / stragglers / OS issues | 10–20 min |
| **Total** | | **90–120 min** |

---

## What the Draft Already Has (Keep)

- Three-Tier Model explanation — solid, keep as-is
- Ecosystem comparison text — trim to 5-7 min talk points
- Stripe boilerplate code (package.json, server.js, payment.js, .env) — production-ready, use verbatim
- Review Queue walkthrough narrative — good, move to Act 3.2
- Prompting section with exact prompt — keep verbatim

## What Needs to Be Added to tutorial.md

- Prerequisites block at the top
- Concrete install steps (per OS) replacing "navigate to official repository"
- Vault setup walkthrough with folder structure
- MCP configuration steps (copy snippet, where to paste per editor)
- Room checkpoint after Act 2
- Timing markers per section
- Closing / "what's next" section

---

## Out of Scope

- Troubleshooting appendix (not requested)
- Presenter notes / facilitator callouts (not requested)
- Self-paced written version (live only)
