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
