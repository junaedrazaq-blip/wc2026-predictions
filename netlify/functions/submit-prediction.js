const { getStore } = require("@netlify/blobs");
const { MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES } = require("./matches-data");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Invalid JSON" }; }

  const { name, predictions } = body;
  if (!name?.trim()) return { statusCode: 400, body: JSON.stringify({ error: "Name required" }) };
  if (!predictions) return { statusCode: 400, body: JSON.stringify({ error: "Predictions required" }) };

  // Load deadline overrides
  let deadlineOverrides = {};
  try {
    const cfg = getStore("config");
    deadlineOverrides = (await cfg.get("deadline-overrides", { type: "json" })) || {};
  } catch {}

  // Load knockout fixtures to get their deadlineKeys
  let knockoutFixtures = [];
  try {
    const cfg = getStore("config");
    knockoutFixtures = (await cfg.get("knockout-fixtures", { type: "json" })) || [];
  } catch {}

  const allDeadlines = { ...MATCHDAY_DEADLINES, ...KNOCKOUT_ROUND_DEADLINES, ...deadlineOverrides };
  const now = new Date();

  // Build map of matchId → deadlineKey for knockout fixtures
  const knockoutDeadlineMap = {};
  knockoutFixtures.forEach(f => { knockoutDeadlineMap[f.id] = f.deadlineKey; });

  // Filter out predictions for matches whose deadline has passed
  const valid = {};
  const locked = [];

  for (const [matchId, pred] of Object.entries(predictions)) {
    if (pred.home === undefined || pred.away === undefined) continue;

    // Determine deadline for this match
    let deadlineKey;
    if (matchId.startsWith("ko-")) {
      deadlineKey = knockoutDeadlineMap[matchId];
    } else {
      // Group stage: derive from matchId → look up in GROUP_MATCHES
      const { GROUP_MATCHES } = require("./matches-data");
      const match = GROUP_MATCHES.find(m => m.id === matchId);
      deadlineKey = match?.deadlineKey;
    }

    const deadline = deadlineKey ? allDeadlines[deadlineKey] : null;

    if (deadline && new Date(deadline) < now) {
      locked.push(matchId);
    } else {
      valid[matchId] = pred;
    }
  }

  if (Object.keys(valid).length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "All predictions are past their deadline", locked }),
    };
  }

  const store = getStore("predictions");
  const key = name.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  await store.setJSON(key, {
    id: key,
    name: name.trim(),
    predictions: valid,
    lockedOut: locked,
    submittedAt: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true, id: key, accepted: Object.keys(valid).length, locked: locked.length }),
  };
};
