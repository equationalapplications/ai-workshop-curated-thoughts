/**
 * TODO for Workshop Attendees:
 * Open your Agent Chat and prompt it with:
 * "Use the curated-thoughts tool to look up the Acme Loyalty Points Specification.
 *  Write the implementation for calculatePoints using the exact multipliers and
 *  category rules from the document."
 */
function calculatePoints(amount, userTier, category, dayOfWeek, hasActiveSubscription) {
  // [Agent will inject the logic here]
  return 0;
}

// --- Instant Local Testing ---
// Once the agent writes the code, run `node calculator.js` to verify.
console.log("Test 1 (Silver, $100, Monday):", calculatePoints(100, 'Silver', 'Clothing', 'Monday', false));
// Expected: 1500

console.log("Test 2 (Gold, $100, Tuesday):", calculatePoints(100, 'Gold', 'Clothing', 'Tuesday', true));
// Expected: 2550

console.log("Test 3 (Bronze, $300, Electronics):", calculatePoints(300, 'Bronze', 'Electronics', 'Friday', false));
// Expected: 500
