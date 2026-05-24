Here is a comprehensive workshop tutorial outline incorporating the new flowchart, comparative talking points, and brainstormed ideas for your demo repository and documents.

---

# Workshop: Architecting AI Memory with Curated Thoughts

**Objective:** Understand the architectural philosophy behind Curated Thoughts, install the application, and use it as a local, unified Model Context Protocol (MCP) server to give your VSCode agent persistent memory.

## Part 1: The Architecture of Curated Thoughts

Before we dive into the code, let's look at how Curated Thoughts works under the hood and how it compares to other AI memory tools in the ecosystem.

Curated Thoughts acts as a unified hybrid knowledge graph. It ingests data through a **Three-Tier Memory System**:

1. **Facts Tier:** Immutable documents and PDFs (e.g., API specs).
2. **Wisdom Tier:** Living, AI-synthesized wiki documents.
3. **Working Tier:** Ephemeral local code repositories.

### How It Compares to the Ecosystem

To understand why Curated Thoughts is built this way, it helps to compare it to similar tools:

* **CodeGraph (The AST Sibling):** Similar to [CodeGraph](https://github.com/colbymchenry/codegraph), Curated Thoughts uses strict Tree-sitter AST parsing to map explicit relationships (like function calls and imports) in your code. This means neither app relies on expensive LLM calls to figure out how your code is wired together. However, Curated Thoughts goes further by fusing this structural code graph with semantic document retrieval.
* **GBrain (The Markdown Counterpart):** [GBrain](https://www.marktechpost.com/2026/05/22/a-step-by-step-coding-tutorial-to-implement-gbrain-the-self-wiring-memory-layer-built-by-y-combinators-garry-tan-for-ai-agents/) uses a deterministic Regex engine to auto-link plain Markdown files without LLMs. While Curated Thoughts also values deterministic linking (via AST for code), it relies on an Active Librarian to synthesize human-readable wiki pages and identify architectural inconsistencies between your docs and your code.
* **Open Brain / OB1 (The Cloud Alternative):** [Open Brain](https://github.com/NateBJones-Projects/OB1) is a cloud-first, infrastructure-level memory layer built on Supabase, meant to be accessed via remote HTTP/SSE connections. In contrast, Curated Thoughts is fiercely **local-first**. It runs on a Tauri/Rust backend with a local SQLite database and serves its MCP via secure standard input/output (stdio) directly on your machine.

## Part 2: Installation and Setup

For this workshop, we will be using the prebuilt desktop application.

1. Navigate to the official repository.
2. Follow the standard installation instructions detailed in the **README** to download and install the app for your specific operating system (Windows, macOS, or Linux).
3. Once installed, open the app, navigate to Settings, and copy your auto-generated MCP configuration.
4. Paste this configuration into your VSCode Copilot/Agent settings to connect the unified MCP server.

## Part 3: The Stripe API Integration

The Stripe API Integration perfectly highlights how Curated Thoughts uses your immutable Facts Tier to dictate exactly how the Working Tier (your code) should be written, eliminating the hallucinated payloads that LLMs frequently generate when coding from memory.

To ensure the demo goes smoothly, we want to provide the agent with a clean, focused set of instructions and the exact API specifications it needs to write the controller.

Here are the specific Stripe documents you should prepare and how to organize them.

### The Required Stripe Documents

You will want to capture these pages either by saving them as PDFs via your browser's print dialog, or by using a web-clipper to save them as plain Markdown files.

1. **The Core Implementation Guide:**
* **Source:** [Stripe Documentation: Build a checkout page with Payment Intents API](https://docs.stripe.com/payments/quickstart?lang=node)
* **Why it's needed:** This gives the agent the conceptual step-by-step logic for a Node.js backend flow (e.g., configuring the Stripe client, instantiating the session, and handling the success/cancel URLs).


2. **The Exact API Specification:**
* **Source:** [Stripe API Reference: Create a Checkout Session](https://docs.stripe.com/api/checkout/sessions/create)
* **Why it's needed:** This is the most critical file. It contains the strict `line_items`, `price_data`, `currency`, and `mode` parameter payload structures that the agent must strictly adhere to when writing the Express controller.



### How to Organize Them for the Demo

To make the workshop setup instant for your attendees, you should package these documents directly in your boilerplate repository.

1. In the root of your demo repository, create a directory structure that matches the Curated Thoughts vault structure:
```text
/your-demo-repo
├── /controllers
│   └── payment.js      <-- (The empty file they will ask the agent to fill)
├── /documents
│   └── /stripe
│       ├── stripe-node-quickstart.pdf
│       └── stripe-checkout-session-api.pdf
├── server.js
└── package.json

```


2. During the workshop, you can simply instruct the attendees to point their Curated Thoughts app to watch this specific repository. The Active Librarian will instantly detect the `documents/stripe/` folder and begin embedding those facts into their local memory.

---

Here is the exact boilerplate you can package into a ZIP file or a starter repository for your attendees.

By keeping the controller empty but leaving a clear `TODO` comment, the AI agent will know exactly where to inject the code it synthesizes from the Stripe documentation in their local memory.

### 1. `package.json`

Keep the dependencies minimal. They just need Express and Stripe.

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

### 2. `server.js`

This is the entry point. It sets up the Express server and routes traffic to the payment controller.

```javascript
require('dotenv').config();
const express = require('express');
const paymentRoutes = require('./controllers/payment');

const app = express();
app.use(express.json());
app.use(express.static('public')); // For serving a simple frontend if needed

// Mount the payment routes
app.post('/api/create-checkout-session', paymentRoutes.createCheckoutSession);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

```

### 3. `controllers/payment.js`

This is the file your attendees will open during the demo. The structure is prepared, but the logic is empty.

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Controller: Create Checkout Session
 * * TODO for Workshop Attendees: 
 * Open your Agent Chat and prompt it with:
 * "Use the curated-thoughts tool to look up the Stripe API specs in our memory. 
 * Write the implementation for this createCheckoutSession controller using 
 * the exact required payload structure from the documentation."
 */
exports.createCheckoutSession = async (req, res) => {
    try {
        // [Agent will inject the Stripe Checkout Session logic here]
        
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: error.message });
    }
};

```

### 4. `.env` (Template)

Provide a sample environment file so the app doesn't crash when testing the code.

```env
# Add your test Stripe Secret Key here (starts with sk_test_...)
STRIPE_SECRET_KEY=sk_test_your_key_here
PORT=4242

```

### Curating the Wisdom Tier 

Demonstrate the human-in-the-loop approval process and explore the generated knowledge.

The Approval Queue: In the Curated Thoughts UI, navigate to the Review Queue. Show the attendees that the Active Librarian has proposed new wiki pages (e.g., "Stripe Checkout Integration Rules" or "Required Payload Structures").

Human-in-the-Loop: Have the attendees review and Approve these changes.

Explore the Wiki: Navigate to the wiki/ tab in the UI. Open the newly approved pages.

Talking Point: Highlight that this is the Wisdom Tier. The AI didn't just store the PDFs; it read them and wrote a living, readable architectural guide for the repository. The coding agent will now use both the raw facts and this synthesized wisdom to write perfect code.

### Prompting & Synthesis

Time to execute the task.

* Have attendees open their VSCode Agent chat.
* **The Prompt:** *"Use the curated-thoughts tool to look up the Stripe API specs in our memory. Write the implementation for the `createCheckoutSession` controller using the exact required payload structure from the documentation."*
* **Observation:** Tell the attendees to watch the agent's thought process. They should see the agent actively invoke the MCP tool, query the local database, and read the specific chunks from the Stripe PDFs before it starts writing code.
* Accept the code and save the file.

### Code Review & Testing

Do not just accept the code and move on; verify it against the facts.

* Open the `payment.js` file and compare the generated payload directly alongside the Stripe API PDF.
* Check that the `line_items`, `mode`, and `success_url` match the strict requirements of the documentation.
* **Optional:** If anyone set up their `.env` file with a test Stripe key, run `npm start` and trigger a test POST request to the endpoint to prove it compiles and functions.