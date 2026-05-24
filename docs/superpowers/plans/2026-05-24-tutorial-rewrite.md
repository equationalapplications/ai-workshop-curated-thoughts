# Tutorial Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `tutorial.md` into a three-act, 90–120 min live workshop document for AI practitioners, and extract the demo boilerplate into real files under `demo/`.

**Architecture:** Complete replacement of `tutorial.md` with spec-aligned three-act structure. Boilerplate code blocks from draft extracted into `demo/` directory for easy ZIP distribution. No new tooling — pure Markdown and JS files.

**Tech Stack:** Markdown, Node.js/Express (demo boilerplate)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `tutorial.md` | Full rewrite — three-act structure, prerequisites, concrete install steps, MCP config, timing |
| Create | `demo/package.json` | Stripe demo app dependencies |
| Create | `demo/server.js` | Express entry point |
| Create | `demo/controllers/payment.js` | Empty stub attendees fill during workshop |
| Create | `demo/.env.example` | Environment variable template |
| Create | `demo/README.md` | Setup instructions for the demo repo |

---

## Task 1: Write Prerequisites + Document Header

**Files:**
- Modify: `tutorial.md` (full replace)

- [ ] **Step 1: Verify spec requirements for this section**

  Check that output will contain:
  - Workshop title with duration/audience/outcome metadata
  - All 5 prerequisites with exact commands where applicable
  - Binary download framed as "before workshop" (install happens live in Act 2)

- [ ] **Step 2: Write the header and prerequisites block**

  Replace the entire contents of `tutorial.md` with:

  ```markdown
  # Workshop: Architecting AI Memory with Curated Thoughts

  > **Duration:** 90–120 min | **Audience:** AI practitioners | **Outcome:** Working local setup with MCP wired into your editor

  ## Prerequisites

  Complete before the workshop:

  - [ ] Ollama installed and running — [ollama.com](https://ollama.com)
  - [ ] `nomic-embed-text` model pulled: `ollama pull nomic-embed-text`
  - [ ] VSCode or Cursor installed
  - [ ] Curated Thoughts binary downloaded from [GitHub Releases](https://github.com/equationalapplications/curated-thoughts/releases) (install happens live in Act 2)
  - [ ] Node.js 18+ installed (for the Stripe demo boilerplate)

  ---
  ```

- [ ] **Step 3: Verify**

  Read `tutorial.md`. Confirm:
  - Title present
  - Duration/audience/outcome in subtitle
  - All 5 prerequisite bullets present with commands
  - Binary download says "install happens live in Act 2"

- [ ] **Step 4: Commit**

  ```bash
  git add tutorial.md
  git commit -m "docs: start tutorial rewrite — header and prerequisites"
  ```

---

## Task 2: Write Act 1 — Architecture (~20 min)

**Files:**
- Modify: `tutorial.md` (append)

- [ ] **Step 1: Verify spec requirements for Act 1**

  Check output will contain:
  - Hook with concrete Stripe hallucination failure mode (3 min)
  - Three-tier table: Facts / Wisdom / Working with mutability column (8 min)
  - Key insight: tiers compose, all three retrieved in one MCP query
  - Ecosystem comparison: CodeGraph, GBrain, OB1 (5 min, brief)
  - Pipeline diagram as ASCII flow (4 min)
  - Section timing markers on headings

- [ ] **Step 2: Append Act 1 to `tutorial.md`**

  Append to `tutorial.md`:

  ```markdown
  ## Act 1: Why This Exists + How It Works (~20 min)

  ### The Problem (~3 min)

  Prompt your coding agent: *"Write me a Stripe checkout controller."*

  It writes something. The payload looks plausible. But it hallucinates parameter names, inverts required and optional fields, uses deprecated API shapes from its training data. You spend 30 minutes debugging against the real Stripe docs.

  The root cause: the agent is reasoning from memory, not from your actual specs. Curated Thoughts gives agents a local, authoritative memory grounded in documents you control.

  ### The Three-Tier Memory Model (~8 min)

  Curated Thoughts organizes knowledge into three tiers that compose at query time:

  | Tier | Name | What lives here | Mutability |
  |------|------|-----------------|------------|
  | 1 | **Facts** | PDFs, API specs, immutable source docs | Immutable — app never writes here |
  | 2 | **Wisdom** | AI-synthesized wiki pages, architectural summaries | Living — approved by you |
  | 3 | **Working** | Local code repositories, watched by AST parser | Ephemeral — re-indexed on change |

  When you query via MCP, the retrieval facade hits all three simultaneously. One query returns raw spec chunks (Facts), synthesized summaries (Wisdom), and structural code context (Working).

  ### Ecosystem Comparison (~5 min)

  For practitioners who will ask:

  - **CodeGraph** — AST sibling. Both use Tree-sitter for structural code graphs without LLM calls. CodeGraph is code-only; Curated Thoughts fuses code structure with document retrieval.
  - **GBrain** — Deterministic regex-based Markdown linker, no LLMs. Curated Thoughts trades full determinism for synthesis: an Active Librarian writes readable wiki pages from your documents.
  - **Open Brain / OB1** — Cloud-first, Supabase-backed, remote HTTP/SSE. Curated Thoughts is local-only: stdio MCP, SQLite on disk, Rust backend. Trust boundary stays on your machine.

  ### The Pipeline (~4 min)

  ```
  watch files → convert (PDF/DOCX → markdown) → chunk → embed → SQLite
       → Active Librarian proposes wiki pages → human approves → wiki/ written
       → MCP query → retrieval facade (semantic cosine + keyword fallback) → agent context
  ```

  ---
  ```

- [ ] **Step 3: Verify**

  Read `tutorial.md` Act 1 section. Confirm:
  - Three-tier table has all 4 columns including Mutability
  - "tiers compose" key insight present
  - All three ecosystem peers covered with their differentiator
  - Pipeline flow ends with "agent context"
  - `---` separator at end

- [ ] **Step 4: Commit**

  ```bash
  git add tutorial.md
  git commit -m "docs: add Act 1 — architecture, three-tier model, ecosystem comparison"
  ```

---

## Task 3: Write Act 2 — Install + Configure (~40 min)

**Files:**
- Modify: `tutorial.md` (append)

- [ ] **Step 1: Verify spec requirements for Act 2**

  Check output will contain:
  - Act milestone statement (every attendee's editor has MCP wired)
  - Install steps for all 3 OS: macOS (dmg + Security bypass), Linux (AppImage + deb), Windows (msi + Defender bypass)
  - Vault setup with `mkdir` commands and folder tree
  - Note that Stripe PDFs dropped NOW (not in Act 3) — indexing starts early
  - Ollama verify: `ollama list` command + `ollama pull nomic-embed-text` fallback
  - Setup Status panel check
  - MCP config: Settings → copy snippet
  - VSCode paste location (`.vscode/mcp.json`)
  - Cursor paste location (`.cursor/mcp.json`)
  - Test query to confirm tool invoked
  - Room checkpoint section

- [ ] **Step 2: Append Act 2 to `tutorial.md`**

  Append to `tutorial.md`:

  ````markdown
  ## Act 2: Install + Configure (~40 min)

  **Milestone:** Every attendee's editor has `curated-thoughts` wired as MCP by the end of this act.

  ### Install the App (~8 min)

  Download from [GitHub Releases](https://github.com/equationalapplications/curated-thoughts/releases). Choose the asset for your OS:

  **macOS**
  1. Download the `.dmg` file
  2. Open it, drag Curated Thoughts to Applications
  3. First launch: macOS will block it — open **System Preferences → Security & Privacy → General**, click **Open Anyway**
  4. The Setup Wizard opens — work through it

  **Linux**
  1. Download the `.AppImage` or `.deb`
  2. AppImage: `chmod +x CuratedThoughts.AppImage && ./CuratedThoughts.AppImage`
  3. deb: `sudo dpkg -i curated-thoughts_*.deb`
  4. The Setup Wizard opens on first launch

  **Windows**
  1. Download the `.msi` installer
  2. Run it — Windows Defender may warn; click **More Info → Run Anyway**
  3. The Setup Wizard opens after install

  ### Set Up Your Vault (~12 min)

  A vault is a folder the app watches. Create one anywhere:

  ```bash
  mkdir ~/curated-vault
  mkdir -p ~/curated-vault/documents/stripe
  ```

  In the app, point the vault at `~/curated-vault`. The app creates `.brain/` automatically.

  Drop the workshop Stripe PDFs into `documents/stripe/` (from the ZIP distributed before the workshop):

  ```
  ~/curated-vault/
  ├── documents/
  │   └── stripe/
  │       ├── stripe-node-quickstart.pdf
  │       └── stripe-checkout-session-api.pdf
  └── .brain/                              ← created by app
  ```

  Watch the indexing indicator in the app UI. The pipeline is running: convert → chunk → embed. Starting now means indexing will be complete before the Act 3 demo.

  ### Verify Ollama (~5 min)

  ```bash
  ollama list
  ```

  Expected: `nomic-embed-text` appears in the list. If missing:

  ```bash
  ollama pull nomic-embed-text
  ```

  In the app, open **Setup Status**. All indicators green = ready to continue.

  ### Wire the MCP (~10 min)

  In the app: **Settings → MCP Configuration → Copy**.

  You'll get a JSON snippet:

  ```json
  {
    "mcpServers": {
      "curated-thoughts": {
        "command": "/path/to/curated-thoughts-mcp",
        "env": {
          "CURATED_BRAIN_DIR": "/path/to/.brain"
        }
      }
    }
  }
  ```

  **VSCode Copilot** — paste into `.vscode/mcp.json` at your workspace root:

  ```json
  {
    "mcpServers": {
      "curated-thoughts": {
        "command": "/path/to/curated-thoughts-mcp",
        "env": {
          "CURATED_BRAIN_DIR": "/path/to/.brain"
        }
      }
    }
  }
  ```

  **Cursor** — paste into `.cursor/mcp.json` at your repo root or home directory.

  Restart the editor. Open agent chat. Run:

  ```
  use curated-thoughts to search for "stripe"
  ```

  You should see the tool invoked in the agent's reasoning trace. If not, verify the `command` path in the MCP config and restart the editor.

  ### Room Checkpoint (~5 min)

  Before Act 3: confirm everyone has `curated-thoughts` visible in their agent chat. Fix stragglers now — the demo requires a working MCP connection.

  ---
  ````

- [ ] **Step 3: Verify**

  Read `tutorial.md` Act 2 section. Confirm:
  - macOS, Linux, Windows each have their own numbered steps
  - `mkdir` commands present for vault setup
  - Folder tree shows expected structure
  - "Starting now means indexing will be complete before Act 3" note present
  - `ollama list` command present with expected output description
  - `ollama pull nomic-embed-text` fallback present
  - MCP snippet JSON block present
  - Both VSCode and Cursor paste locations documented
  - Test query `use curated-thoughts to search for "stripe"` present
  - Room checkpoint section present

- [ ] **Step 4: Commit**

  ```bash
  git add tutorial.md
  git commit -m "docs: add Act 2 — install, vault setup, Ollama verify, MCP config"
  ```

---

## Task 4: Write Act 3 — Stripe Demo (~40 min)

**Files:**
- Modify: `tutorial.md` (append)

- [ ] **Step 1: Verify spec requirements for Act 3**

  Check output will contain:
  - Act milestone statement (prompt retrieves from local memory, writes correct code)
  - Indexing confirmation step (both files green)
  - Review Queue walkthrough — approve one page, navigate to wiki/, key talking point
  - Boilerplate repo folder tree
  - Reference to `controllers/payment.js` empty stub
  - Verbatim workshop prompt (exact quote)
  - Four observation bullets for agent trace
  - Code review checklist: `line_items`, `mode`, `success_url`
  - Optional curl test command
  - "What's Next" with 3 concrete next steps
  - All 3 resource links
  - Timing reference table

- [ ] **Step 2: Append Act 3 to `tutorial.md`**

  Append to `tutorial.md`:

  ````markdown
  ## Act 3: Stripe Demo (~40 min)

  **Milestone:** Prompt an agent that retrieves from local memory and writes correct, spec-grounded Stripe code.

  ### Confirm Indexing Complete (~5 min)

  The Stripe PDFs you dropped in Act 2 should be fully indexed by now. Check the app UI — both files should show green status in the vault view.

  Both are now in your **Facts Tier**: immutable, authoritative source of truth for the Stripe API.

  ### Curate the Wisdom Tier (~10 min)

  Open the **Review Queue** tab.

  The Active Librarian has read your Stripe PDFs and proposed wiki pages, for example:
  - "Stripe Checkout Integration Rules"
  - "Required Payload Structures for Checkout Sessions"

  Review one proposal. Approve it.

  Navigate to the **Wiki** tab. Open the approved page.

  **Key point:** The LLM didn't just store bytes. It read the PDFs and wrote a readable architectural guide. Your agent now retrieves both raw spec chunks (Facts) and this synthesized summary (Wisdom) in a single query — two layers of grounding.

  ### Open the Boilerplate Repo (~3 min)

  Clone or unzip the starter repo (from the facilitator):

  ```
  curated-thoughts-stripe-demo/
  ├── controllers/
  │   └── payment.js       ← empty stub — fill this with the agent
  ├── server.js
  ├── package.json
  └── .env.example
  ```

  Open `controllers/payment.js`. The implementation is a bare try/catch shell with a TODO comment.

  ### Prompt the Agent (~10 min)

  Open VSCode/Cursor agent chat. Run this prompt verbatim:

  > *"Use the curated-thoughts tool to look up the Stripe API specs in our memory. Write the implementation for the `createCheckoutSession` controller using the exact required payload structure from the documentation."*

  Watch the agent:
  1. Invoke the `curated-thoughts` MCP tool
  2. Query your local SQLite database
  3. Read back chunks from the Stripe PDFs
  4. Write code grounded in your actual docs — not training memory

  Accept the generated code and save.

  ### Code Review + Verify (~7 min)

  Open `payment.js` side-by-side with the Stripe API PDF.

  Verify the generated payload:
  - `line_items` array with nested `price_data` object — required
  - `mode: 'payment'` — required
  - `success_url` and `cancel_url` — required

  If the agent produced all three correctly, the demo is working: spec-grounded generation with no hallucinated parameters.

  **Optional — run the server** (requires Stripe test key in `.env`):

  ```bash
  npm install
  npm start
  ```

  ```bash
  # In a second terminal:
  curl -X POST http://localhost:4242/api/create-checkout-session \
    -H "Content-Type: application/json" \
    -d '{"items": [{"name": "Workshop Item", "amount": 1000, "quantity": 1}]}'
  ```

  ### What's Next (~5 min)

  Add your own knowledge to the Facts Tier:
  - Your API specs, architecture decision records, runbooks → `documents/`
  - Your actual codebase → Working Tier (configure in app Settings under **Watched Repositories**)
  - Use the MCP from any agent: Claude Code, Cursor, VSCode Copilot, Cline

  **Resources:**
  - [Curated Thoughts on GitHub](https://github.com/equationalapplications/curated-thoughts)
  - [`@equationalapplications/react-llm-wiki`](https://www.npmjs.com/package/@equationalapplications/react-llm-wiki)
  - [`@equationalapplications/core-llm-wiki`](https://www.npmjs.com/package/@equationalapplications/core-llm-wiki)

  ---

  ## Timing Reference

  | Act | Content | Time |
  |-----|---------|------|
  | Pre-workshop | Prerequisites, download binary | Before |
  | Act 1 | Architecture | ~20 min |
  | Act 2 | Install + Configure | ~40 min |
  | Act 3 | Stripe Demo | ~40 min |
  | Buffer | Q&A / OS issues | 10–20 min |
  | **Total** | | **90–120 min** |
  ````

- [ ] **Step 3: Verify**

  Read `tutorial.md` Act 3 section. Confirm:
  - Review Queue steps: open tab → approve → wiki tab → open page
  - Key talking point about Facts + Wisdom both retrieved present
  - Boilerplate folder tree present with `← empty stub` annotation
  - Verbatim prompt in blockquote
  - Four numbered observation bullets
  - All three required fields listed: `line_items`, `mode`, `success_url`
  - `curl` test command present in optional block
  - "What's Next" with at least 3 concrete actions
  - Timing reference table at bottom

- [ ] **Step 4: Commit**

  ```bash
  git add tutorial.md
  git commit -m "docs: add Act 3 — Stripe demo, review queue, prompting, code review, closing"
  ```

---

## Task 5: Create Demo Boilerplate Files

**Files:**
- Create: `demo/package.json`
- Create: `demo/server.js`
- Create: `demo/controllers/payment.js`
- Create: `demo/.env.example`
- Create: `demo/README.md`

- [ ] **Step 1: Create directory structure**

  ```bash
  mkdir -p demo/controllers
  ```

- [ ] **Step 2: Write `demo/package.json`**

  ```json
  {
    "name": "curated-thoughts-stripe-demo",
    "version": "1.0.0",
    "description": "Workshop demo for Curated Thoughts unified MCP",
    "main": "server.js",
    "scripts": {
      "start": "node server.js"
    },
    "dependencies": {
      "dotenv": "^16.4.5",
      "express": "^4.19.2",
      "stripe": "^15.8.0"
    }
  }
  ```

- [ ] **Step 3: Write `demo/server.js`**

  ```javascript
  require('dotenv').config();
  const express = require('express');
  const paymentRoutes = require('./controllers/payment');

  const app = express();
  app.use(express.json());
  app.use(express.static('public'));

  app.post('/api/create-checkout-session', paymentRoutes.createCheckoutSession);

  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  ```

- [ ] **Step 4: Write `demo/controllers/payment.js`**

  ```javascript
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  /**
   * TODO for Workshop Attendees:
   * Open your Agent Chat and prompt:
   * "Use the curated-thoughts tool to look up the Stripe API specs in our memory.
   * Write the implementation for this createCheckoutSession controller using
   * the exact required payload structure from the documentation."
   */
  exports.createCheckoutSession = async (req, res) => {
      try {
          // [Agent will inject the Stripe Checkout Session logic here]

      } catch (error) {
          console.error('Error creating checkout session:', error);
          res.status(500).json({ error: error.message });
      }
  };
  ```

- [ ] **Step 5: Write `demo/.env.example`**

  ```
  # Add your Stripe test key (starts with sk_test_...)
  STRIPE_SECRET_KEY=sk_test_your_key_here
  PORT=4242
  ```

- [ ] **Step 6: Write `demo/README.md`**

  ````markdown
  # Curated Thoughts Stripe Demo

  Workshop boilerplate for [Architecting AI Memory with Curated Thoughts](../tutorial.md).

  ## Setup

  ```bash
  cp .env.example .env
  # Add your Stripe test key to .env
  npm install
  npm start
  ```

  ## The Exercise

  Open `controllers/payment.js`. The implementation is intentionally empty.

  With Curated Thoughts running and the Stripe PDFs indexed, open your editor's agent chat and run:

  > "Use the curated-thoughts tool to look up the Stripe API specs in our memory.
  > Write the implementation for the `createCheckoutSession` controller using
  > the exact required payload structure from the documentation."

  The agent should invoke the MCP tool, retrieve spec chunks from your local database, and write a correct implementation grounded in your actual documentation.
  ````

- [ ] **Step 7: Verify**

  ```bash
  ls demo/
  # Expected: controllers/  package.json  server.js  .env.example  README.md
  ls demo/controllers/
  # Expected: payment.js
  ```

- [ ] **Step 8: Commit**

  ```bash
  git add demo/
  git commit -m "docs: add Stripe demo boilerplate — package.json, server, payment stub, env template"
  ```

---

## Task 6: Final Spec Coverage Verification

**Files:**
- No changes expected — this is a read-only verification step

- [ ] **Step 1: Check spec vs tutorial.md**

  Read `tutorial.md` in full. Verify each spec requirement:

  | Spec requirement | Present in tutorial.md? |
  |-----------------|------------------------|
  | Prerequisites block at top | ✓ / ✗ |
  | Binary download as pre-workshop (not live install) | ✓ / ✗ |
  | Concrete install steps per OS (macOS, Linux, Windows) | ✓ / ✗ |
  | Vault `mkdir` commands | ✓ / ✗ |
  | Stripe PDFs dropped in Act 2 with "indexing starts early" note | ✓ / ✗ |
  | `ollama list` verify + `ollama pull` fallback | ✓ / ✗ |
  | MCP config copy step with JSON snippet | ✓ / ✗ |
  | VSCode + Cursor paste locations | ✓ / ✗ |
  | Test query to verify MCP works | ✓ / ✗ |
  | Room checkpoint before Act 3 | ✓ / ✗ |
  | Review Queue: approve, navigate to wiki/, key talking point | ✓ / ✗ |
  | Verbatim workshop prompt in blockquote | ✓ / ✗ |
  | Agent observation bullets | ✓ / ✗ |
  | Code review checklist (line_items, mode, success_url) | ✓ / ✗ |
  | Optional curl test | ✓ / ✗ |
  | "What's Next" with 3+ actions | ✓ / ✗ |
  | Timing reference table | ✓ / ✗ |

  Fix any gaps inline before committing.

- [ ] **Step 2: Check demo/ files match tutorial.md references**

  Verify:
  - `demo/controllers/payment.js` TODO comment matches the prompt in tutorial.md `createCheckoutSession`
  - `demo/server.js` mounts `POST /api/create-checkout-session` (matches curl test in tutorial.md)
  - `demo/.env.example` has `PORT=4242` (matches curl test URL)

- [ ] **Step 3: Commit if any fixes were made**

  ```bash
  git add tutorial.md demo/
  git commit -m "docs: final spec coverage fixes"
  ```

  If no fixes needed, skip this commit.
