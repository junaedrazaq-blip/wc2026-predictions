const { store } = require("./_store");
const { GROUP_MATCHES, MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES } = require("./matches-data");

exports.handler = async () => {
  let knockoutMatches = [];
  let deadlineOverrides = {};

  try {
    const cfg = store("config");
    try { const kf = await cfg.get("knockout-fixtures", { type: "json" }); if (kf) knockoutMatches = kf; } catch {}
    try { const ov = await cfg.get("deadline-overrides", { type: "json" }); if (ov) deadlineOverrides = ov; } catch {}
  } catch {}

  const allDeadlines = { ...MATCHDAY_DEADLINES, ...KNOCKOUT_ROUND_DEADLINES, ...deadlineOverrides };
  const knockoutWithDeadlines = knockoutMatches.map(m => ({ ...m, deadline: allDeadlines[m.deadlineKey] || m.deadline || null }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matches: [...GROUP_MATCHES, ...knockoutWithDeadlines], deadlines: allDeadlines }),
  };
};
