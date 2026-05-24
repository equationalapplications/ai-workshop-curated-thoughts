# Curated Thoughts Acme Demo

Workshop boilerplate for [Architecting AI Memory with Curated Thoughts](../tutorial.md).

## The Exercise

Drop `documents/acme-loyalty-rules.md` into your Curated Thoughts vault and let it index.

Open `calculator.js`. The implementation is intentionally empty.

With Curated Thoughts running and the spec indexed, open your editor's agent chat and run:

> "Use the curated-thoughts tool to look up the Acme Loyalty Points Specification in our memory.
> Write the implementation for `calculatePoints` using the exact multipliers, tier rules,
> and category caps from the document."

The agent should invoke the MCP tool, retrieve spec chunks from your local database, and write a correct implementation grounded in your actual documentation.

## Verify

No install required. Once the agent writes the implementation:

```bash
node calculator.js
```

Expected output:

```
Test 1 (Silver, $100, Monday): 1500
Test 2 (Gold, $100, Tuesday): 2550
Test 3 (Bronze, $300, Electronics): 500
```

All three match = demo works.
