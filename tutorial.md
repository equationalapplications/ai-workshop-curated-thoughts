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

## Act 2: Install + Configure (~40 min)

**Milestone:** Every attendee's editor has `curated-thoughts` wired as MCP by the end of this act.

### Install the App (~8 min)

Download from [GitHub Releases](https://github.com/equationalapplications/curated-thoughts/releases). Choose the asset for your OS:

**macOS**
1. Download the `.dmg` file
2. Open it, drag Curated Thoughts to Applications
3. First launch: macOS will block it — open **System Settings → Privacy & Security** (macOS Ventura+) or **System Preferences → Security & Privacy → General** (older macOS), click **Open Anyway**
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
mkdir -p ~/curated-vault/documents/stripe
```

This creates the full directory tree in one command.

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

**VSCode Copilot** — paste the JSON snippet into `.vscode/mcp.json` at your workspace root. The format is identical to what the app copied.

**Cursor** — paste the same JSON into `.cursor/mcp.json`. Use your repo root for a project-specific setup, or `~/.cursor/mcp.json` for a global setup available across all repos.

Restart the editor. Open agent chat. Run:

```
use curated-thoughts to search for "stripe"
```

You should see the tool invoked in the agent's reasoning trace. If not, verify the `command` path in the MCP config and restart the editor.

### Room Checkpoint (~5 min)

Before Act 3: confirm everyone has `curated-thoughts` visible in their agent chat. Fix stragglers now — the demo requires a working MCP connection.

---

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

> **If the Review Queue is empty:** the Active Librarian is still processing. Wait 2–3 minutes and refresh.

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

> **If the tool is not called:** re-check the `command` path in your MCP config from Act 2 and restart the editor, then retry the prompt.

### Code Review + Verify (~7 min)

Open `payment.js` side-by-side with the Stripe API PDF.

Verify the generated payload:
- `line_items` array with nested `price_data` object — required
- `mode: 'payment'` — required
- `success_url` and `cancel_url` — required

If the agent produced all three correctly, the demo is working: spec-grounded generation with no hallucinated parameters.

**Optional — run the server** (requires Stripe test key in `.env`; `server.js` already wires `POST /api/create-checkout-session`):

First, copy the env template:

```bash
cp .env.example .env
# Edit .env and add your sk_test_... key
```

```bash
npm install
npm start
```

```bash
# In a second terminal:
# amount in cents (1000 = $10 USD)
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
