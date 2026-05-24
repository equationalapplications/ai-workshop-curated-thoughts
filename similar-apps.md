# Apps Similar to Curated Thoughts 

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

