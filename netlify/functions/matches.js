// Returns all matches: group stage (static) + knockout (from Blobs)
const { getStore } = require("@netlify/blobs");
const { GROUP_MATCHES, MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES } = require("./matches-data");

exports.handler = async () => {
  let knockoutMatches = [];
  let deadlineOverrides = {};

  try {
    const store = getStore("config");
    // Load any admin-added knockout fixtures
    try {
      const kf = await store.get("knockout-fixtures", { type: "json" });
      if (kf) knockoutMatches = kf;
    } catch {}
    // Load any deadline overrides set by admin
    try {
      const overrides = await store.get("deadline-overrides", { type: "json" });
      if (overrides) deadlineOverrides = overrides;
    } catch {}
  } catch {}

  const allDeadlines = {
    ...MATCHDAY_DEADLINES,
    ...KNOCKOUT_ROUND_DEADLINES,
    ...deadlineOverrides,
  };

  // Attach live deadlines to knockout matches
  const knockoutWithDeadlines = knockoutMatches.map(m => ({
    ...m,
    deadline: allDeadlines[m.deadlineKey] || m.deadline || null,
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matches: [...GROUP_MATCHES, ...knockoutWithDeadlines],
      deadlines: allDeadlines,
    }),
  };
};
