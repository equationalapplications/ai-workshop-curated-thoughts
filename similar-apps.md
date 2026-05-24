# Apps Similar to Curated Thoughts 

## Curated Thoughts

```ascii
                     +---------------------------------+
                     |   LOCAL DOCUMENTS VAULT         |
                     |      (`documents/` dir)         |
                     |   (Immutable Source Files:      |
                     |    PDF, DOCX, Markdown, etc.)  |
                     +-------+-------------------------+
                             |
                             v
+----------------------------+-------------------------+
|                TAURI / RUST BACKEND                   |
|                                                      |
|   1. FILE WATCHER: Detects additions/changes         |
|   2. INGESTION PIPELINE:                              |
|      +----------+      +-----------+     +---------+ |
|      | CONVERT  |----->|   CHUNK   |---->|  EMBED  | |
|      | (to MD)  |      |  DOCUMENTS |     | (BYOI)  | |
|      +----------+      +-----------+     +---------+ |
|                             |                  |     |
|   3. ACTIVE LIBRARIAN:       v                  v     |
|      +----------------------+-------------------+     |
|      |        LOCAL SQLite DATABASE (.brain/)    |     |
|      |           (Chunks, Vectors, Metadata)     |     |
|      +----------------------+-------------------+     |
|                             |                         |
|                             v                         |
|   4. SYNTHESIS: Uses Local BYOI LLM (e.g. Ollama)     |
|      (via GenerateText + Core LLM Wiki logic)         |
|      to create HUMAN-READABLE Wiki pages.             |
|                             |                         |
|                             v                         |
|      +----------------------+-------------------+     |
|      |       REVIEW & EDIT  (User Flow)         |     |
|      +----------------------+-------------------+     |
|                             |                         |
|                             v                         |
|   5. OUTPUT:                |                         |
|      +----------------------+-------------------+     |
|      |      LLM WIKI PAGES  (`wiki/` dir)       |     |
|      |      (Reviewable, Persisted Memory)      |     |
|      +------------------------------------------+     |
|                                                      |
+----------------------------+-------------------------+
                             |
                             v
+----------------------------+-------------------------+
|                  REACT FRONTEND UI                   |
|                                                      |
|   - BROWSE WIKI & RELATED NOTES                      |
|   - EXPLORE CONTEXT FROM EMBEDDINGS                   |
|   - SEARCH:                                           |
|     +----------------------------------+             |
|     | SEMANTIC SEARCH: Cosine Similarity|             |
|     | KEYWORD FALLBACK: MiniSearch       |             |
|     +----------------------------------+             |
+------------------------------------------------------+

                             +-------------------------+
                             | EXPERIMENTAL: MCP SERVER|
                             | (Hosts stdio server)    |
                             | Allow external agents   |
                             | (Cursor, Claude Desktop)|
                             | to connect IN and query:||
                             +-----------+-------------+
                                         |
                                         v
+----------------------------------------+-------------+
|               EXTERNAL AI AGENTS                     |
|         - Query SQLite Brain Chunks                 |
|         - Access Metadata                           |
|         - Utilize Local Knowledge Base              |
+------------------------------------------------------+

```

## GBrain

I just saw this today in my news feed.

https://www.marktechpost.com/2026/05/22/a-step-by-step-coding-tutorial-to-implement-gbrain-the-self-wiring-memory-layer-built-by-y-combinators-garry-tan-for-ai-agents/

A Step-by-Step Coding Tutorial to Implement GBrain: The Self-Wiring Memory Layer Built by Y Combinator’s Garry Tan for AI Agents

### Organization Focused Knowlege Graph

- works_at
- founded
- invested_in
- attended
- advises
- mentions

Based on a deep dive into the actual `garrytan/gbrain` repository, the flowchart in the original image oversimplifies and slightly misrepresents how the system actually wires itself together.

The image implies that an "AI Agent Analysis" layer is responsible for interpreting relationships and dynamically building the graph. In reality, **gbrain is much more deterministic.** It relies on plain Markdown files as the ultimate source of truth and uses pure Regex pattern matching on wiki-style links (like `[[wiki/people/bob]]`) to build the graph instantly, without wasting tokens or time on LLM calls for the linking itself.

It is also built on a **Bun + TypeScript** runtime and uses either a local **PGLite** (WASM Postgres) or remote **Supabase** instance with `pgvector` for its heavy lifting.

Here is an accurate ASCII flow chart representing the actual architecture and data flow of the `gbrain` repository:

```ascii
                     +---------------------------------------+
                     |        THE BRAIN REPO (GIT)           |
                     |  Plain Markdown Files (Source of Truth)|
                     |  (Humans & Agents can edit freely)    |
                     +-------------------+-------------------+
                                         |
                                         v
+----------------------------------------+---------------------------------------+
|                       GBRAIN RUNTIME (Bun + TypeScript)                        |
|                                                                                |
|  1. INGESTION & AUTO-LINKING (Zero LLM Calls):                                 |
|     +---------------+   +----------------------------------------------+       |
|     | Markdown Page |-->| Extract Links: Regex on [[wiki/type/slug]]   |       |
|     | (Write/Import)|   | (e.g., [[wiki/people/bob]] -> creates link)  |       |
|     +---------------+   +----------------------------------------------+       |
|                                        |                                       |
|  2. BACKGROUND CRONS (Enrichment):     |                                       |
|     - Autonomous jobs run overnight to dedup pages, fix citations,             |
|       score salience, and resolve contradictions.                              |
|                                        |                                       |
|                                        v                                       |
|  3. KNOWLEDGE LAYER (PGLite Local or Supabase Remote):                         |
|     +----------------------+--------------------+------------------------+     |
|     |  DOCUMENT CHUNKS     |  VECTOR EMBEDDINGS |  TYPED KNOWLEDGE GRAPH |     |
|     |  (Postgres FTS/BM25) |  (pgvector HNSW)   |  (works_at, founded...) |     |
|     +----------------------+--------------------+------------------------+     |
|                                                                                |
+----------------------------------------+---------------------------------------+
                                         |
                                         v
+----------------------------------------+---------------------------------------+
|                       TRIPLE-PATH RETRIEVAL & MCP                              |
|                                                                                |
|  +--------------------+ +---------------------+ +---------------------------+  |
|  | BM25 Keyword Search| | Vector Similarity   | | Graph Traversal           |  |
|  | (Postgres tsvector)| | (ZeroEntropy, etc.) | | (Walks links/backlinks)   |  |
|  +--------------------+ +---------------------+ +---------------------------+  |
|               \                   |                  /                         |
|                +--> RECIPROCAL RANK FUSION (RRF) <--+                          |
|                                   |                                            |
|                                   v                                            |
|  +-------------------------------------------------------------------------+   |
|  |                  MODEL CONTEXT PROTOCOL (MCP) SERVER                    |   |
|  | Exposes tools (search, query, put_page, auto-link) to AI Agents.        |   |
|  +-------------------------------------------------------------------------+   |
+----------------------------------------+---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |         AI AGENTS & RUNTIMES          |
                     | (OpenClaw, Hermes, Claude Code)       |
                     | Uses "Fat Markdown Skills" to define  |
                     | workflows and read-enrich-write loops.|
                     +---------------------------------------+

```

### Key Corrections & Architectural Highlights:

* **Regex over LLMs for Graphing:** The most crucial distinction is that `gbrain` does not use an AI agent to interpret and wire the graph dynamically during ingestion. It uses strict pattern matching. If an agent writes `[[wiki/companies/acme]]`, the runtime deterministic code catches it and wires the edge.
* **Triple-Path Retrieval:** When an agent queries `gbrain`, it doesn't just do a standard vector similarity search. It performs a three-pronged search combining exact keyword matching (BM25 via Postgres), Vector Similarity (via `pgvector`), and Graph Traversal (looking at backlinks and edges), fusing the results together using Reciprocal Rank Fusion (RRF).
* **"Fat Markdown Skills":** Rather than having hardcoded Python/TypeScript logic dictating how an agent should behave, `gbrain` uses markdown documents (skills) to instruct the LLM on when to fire, what to check, and how to interact with the database via MCP tools.
* **Pluggable Engine:** It is designed to run entirely locally with zero configuration using **PGLite** (embedded Postgres compiled to WASM), but can instantly migrate to a cloud **Supabase** instance when the scale of the user's brain requires it.

## CodeGraph

I have been using CodeGraph with VSCode and Claude Code. I stole some code graph concepts and integrated them into my memory.

https://github.com/colbymchenry/codegraph

### Code Focused Knowlege Graph

**nodes**
- functions
- classes
- methods 

**edges**
- calls
- imports
- extends
- implements

Here is the accurate ASCII flow chart for the specific architecture and data flow of **`colbymchenry/codegraph`**, based on its actual repository implementation and documentation.

This specific application acts as a bridge between an AI coding agent (like Claude Code or Cursor) and your local codebase, building a persistent semantic graph so the AI doesn't have to blindly `grep` or read entire files and waste tokens.

```ascii
                     +---------------------------------------+
                     |         LOCAL REPOSITORY (GIT)        |
                     |   (Raw Source Files: 19+ Languages)   |
                     +-------------------+-------------------+
                                         |
                                         v
+----------------------------------------+---------------------------------------+
|                     CODEGRAPH ENGINE (npm / npx run)                           |
|                                                                                |
|  1. INGESTION & AUTO-SYNC (Zero LLM / Zero Token Cost):                        |
|     +-------------------------+     +----------------------------------+       |
|     | OS FILE WATCHER         |---->| AST PARSING (tree-sitter)        |       |
|     | (Debounced 2s window,   |     | Extracts: Funcs, Classes, Methods|       |
|     |  Incremental sync)      |     | and Edges (calls, imports, etc.) |       |
|     +-------------------------+     +----------------------------------+       |
|                                        |                                       |
|  2. REFERENCE & ROUTE RESOLUTION:      v                                       |
|     +--------------------------------------------------------------------+     |
|     | Resolves: Function Calls -> Definitions, Imports -> Source Files,  |     |
|     | Class Inheritance, and Web Framework Routing (URL -> Handler Class)|     |
|     +--------------------------------------------------------------------+     |
|                                        |                                       |
|  3. PERSISTENT STORAGE:                v                                       |
|     +--------------------------------------------------------------------+     |
|     |            LOCAL SQLITE DATABASE (.codegraph/codegraph.db)         |     |
|     |             + FTS5 Full-Text Search for instant keyword lookup     |     |
|     +--------------------------------------------------------------------+     |
|                                                                                |
+----------------------------------------+---------------------------------------+
                                         |
                                         v
+----------------------------------------+---------------------------------------+
|                  MODEL CONTEXT PROTOCOL (MCP) INTERFACE                        |
|                                                                                |
|  Exposes graph tools to agents so they don't have to `grep`/`cat` files:       |
|  - Smart Context: One call returns entry points, symbols, and snippets         |
|  - Impact Analysis: Traces blast radius of callers & callees                   |
|  - Cross-Branch Search: Compare code graphs between two branches               |
+----------------------------------------+---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |         AI CODING AGENTS              |
                     | (Claude Code, Cursor, Codex, OpenCode)|
                     | Queries the graph directly, saving    |
                     | high token costs on file exploration  |
                     +---------------------------------------+

```

### Key Differences & Specifics for this Repo:

* **Tree-sitter Parsing:** Like the generalized example previously, `colbymchenry/codegraph` strictly uses `tree-sitter` for rapid Abstract Syntax Tree (AST) mapping. It does not use AI/LLMs to parse the code.
* **Web Framework Route Detection:** A unique feature of this specific repo is that it automatically detects routing files for 13+ web frameworks, meaning it explicitly links a URL route string (e.g., `/api/users`) directly to the backend handler function in the graph.
* **Incremental Auto-Sync:** The runtime includes a native OS file watcher that debounces for 2 seconds when you save a file, ensuring the `.codegraph.db` SQLite database is always hot and instantly updated while you code.
* **FTS5 Full-Text Search:** Alongside the structural graph, it leverages SQLite's FTS5 for blazing-fast full-text search, completely eliminating the need for an AI agent to spawn expensive "explore" sub-agents running `grep` scripts in the terminal.

## Open Brain from Nate B. Jones

Open Brain (specifically known as the OB1 repository) is an open-source, database-backed personal AI memory infrastructure developed by product strategist [Nate B. Jones](https://www.natebjones.com/). It gives AI agents a long-term memory across chat sessions and tool switches. The design stores thoughts in a user-controlled, private SQL database rather than relying on standard third-party SaaS subscriptions. [1, 2, 3, 4, 5] 
## Core Architecture & Strategy

* Direct Database Connection: Connects user data directly to AI models via Anthropic's Model Context Protocol ([MCP](https://github.com/NateBJones-Projects/OB1)).
* Decoupled Embeddings: Stores raw data separate from vector embeddings. This allows users to rebuild indexes easily when newer embedding models debut.
* Headless, Agent-Readable Design: Focuses on making your knowledge natively accessible to an AI loop, rather than building a visual notebook.
* Cost Efficiency: Runs locally or via free/cheap cloud instances like a free-tier Supabase database, costing roughly $0.10 to $0.30 per month. [1, 4, 5, 6, 7, 8] 

## How the Data Flow Works

   1. Quick Capture: You submit a thought using standard communication interfaces like Slack, Discord, or Telegram.
   2. AI Enrichment: A background edge function uses an LLM to interpret the text, extract relevant metadata, and track action items.
   3. Vector Vectorization: The system converts the raw text into a mathematical vector embedding via pgvector inside PostgreSQL.
   4. Retrieval On-Demand: When you launch a fresh chat session, the AI calls the MCP server to run a semantic search and reference your history. [1, 4, 9, 10] 

Based on the actual documentation and architecture in the `NateBJones-Projects/OB1` repository, the original flowchart missed the core philosophy of Open Brain.

OB1 is not a local application or a markdown-based system. It is a **cloud-first, infrastructure-level memory layer** designed to be the *single source of truth* for all your AI tools. Instead of every AI client (Cursor, Claude, ChatGPT) having its own isolated memory, they all plug into the same remote MCP server.

Here is the accurate ASCII flowchart detailing how Open Brain (OB1) operates under the hood:

```ascii
                     +---------------------------------------+
                     |        ANY AI CLIENT / AGENT          |
                     | (Claude Desktop, Cursor, ChatGPT, etc)|
                     |   (All share the SAME brain/memory)   |
                     +-------------------+-------------------+
                                         |
                                         |  Remote MCP Connection (HTTP/SSE)
                                         |  (URL with ?key=your-access-key)
                                         v
+----------------------------------------+---------------------------------------+
|                  SUPABASE EDGE FUNCTION (The MCP Server)                       |
|           (Zero-maintenance serverless function: `open-brain-mcp`)             |
|                                                                                |
|  1. EXPOSED MCP TOOLS:                                                         |
|     +-------------------+ +---------------------+ +------------------------+   |
|     | capture_thought() | | search_thoughts()   | | list_thoughts() / stats|   |
|     | (Writes Memory)   | | (Semantic Retrieval)| | (Context Browsing)     |   |
|     +---------+---------+ +----------+----------+ +------------------------+   |
|               |                      |                                         |
|  2. EMBEDDING GATEWAY:               |                                         |
|     +---------v----------------------v--+                                      |
|     |           OPENROUTER API          |--> Future-proof routing (You aren't  |
|     |  (Generates Vector Embeddings)    |    locked to OpenAI/Anthropic APIs)  |
|     +-----------------------------------+                                      |
+----------------------------------------+---------------------------------------+
                                         |
                                         |  Read / Write SQL Operations
                                         v
+----------------------------------------+---------------------------------------+
|                SUPABASE POSTGRESQL DATABASE (The Storage Layer)                |
|                                                                                |
|  +-------------------------------------------------------------------------+   |
|  |                            `thoughts` TABLE                             |   |
|  |                                                                         |   |
|  | - Raw Content: The exact text, thought, or memory captured.             |   |
|  | - Embeddings: Powered by `pgvector` for instant semantic search.        |   |
|  | - Metadata: Source, tags, and context tracking.                         |   |
|  | - Fingerprint: Built-in deduplication (prevents duplicate captures).    |   |
|  | - Security: PostgreSQL Row Level Security (RLS) for privacy.            |   |
|  +-------------------------------------------------------------------------+   |
+--------------------------------------------------------------------------------+

```

### Key Architectural Distinctions of OB1:

* **Cloud-First, Not Local:** Unlike "Curated Thoughts" (which uses local SQLite and Rust), OB1 relies on **Supabase** (PostgreSQL) and Edge Functions. This allows you to access your brain from anywhere, on any device, without needing to keep a local server running.
* **Remote MCP over HTTP/SSE:** Because it's hosted on a Supabase Edge Function, AI clients connect to it via a URL rather than a local standard input/output (stdio) process. This is what allows cloud-based tools (like ChatGPT's web interface) to connect to it.
* **OpenRouter Abstraction:** OB1 deliberately uses OpenRouter for generating embeddings rather than hardcoding OpenAI. This ensures one account, one API key, and total model portability if you decide to switch AI providers later.
* **The "Bring Your Own AI" Philosophy:** The database has no UI. There is no frontend notes app. It relies entirely on the AI interfaces you already use (Cursor for coding, Claude Desktop for writing, ChatGPT for mobile chat) to read and write to the same central graph via the standard MCP protocol.