# Curated Thoughts Stripe Demo

Workshop boilerplate for [Architecting AI Memory with Curated Thoughts](../tutorial.md).

## Setup

Copy the env template and add your Stripe test key:

    cp .env.example .env

Then install dependencies and start the server:

    npm install
    npm start

## The Exercise

Open `controllers/payment.js`. The implementation is intentionally empty.

With Curated Thoughts running and the Stripe PDFs indexed, open your editor's agent chat and run:

> "Use the curated-thoughts tool to look up the Stripe API specs in our memory.
> Write the implementation for the `createCheckoutSession` controller using
> the exact required payload structure from the documentation."

The agent should invoke the MCP tool, retrieve spec chunks from your local database, and write a correct implementation grounded in your actual documentation.

## Route

`POST /api/create-checkout-session` — wired in `server.js`.
