const { store } = require("./_store");
const { MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES, GROUP_MATCHES } = require("./matches-data");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Invalid JSON" }; }

  const { name, predictions } = body;
  if (!name?.trim()) return { statusCode: 400, body: JSON.stringify({ error: "Name required" }) };
  if (!predictions)  return { statusCode: 400, body: JSON.stringify({ error: "Predictions required" }) };

  let deadlineOverrides = {};
  let knockoutFixtures  = [];
  try { deadlineOverrides = (await store("config").get("deadline-overrides", { type: "json" })) || {}; } catch {}
  try { knockoutFixtures  = (await store("config").get("knockout-fixtures",  { type: "json" })) || []; } catch {}

  const allDeadlines = { ...MATCHDAY_DEADLINES, ...KNOCKOUT_ROUND_DEADLINES, ...deadlineOverrides };
  const now = new Date();
  const knockoutDeadlineMap = {};
  knockoutFixtures.forEach(f => { knockoutDeadlineMap[f.id] = f.deadlineKey; });

  const valid = {}, locked = [];
  for (const [matchId, pred] of Object.entries(predictions)) {
    if (pred.home === undefined || pred.away === undefined) continue;
    let deadlineKey;
    if (matchId.startsWith("ko-")) {
      deadlineKey = knockoutDeadlineMap[matchId];
    } else {
      const match = GROUP_MATCHES.find(m => m.id === matchId);
      deadlineKey = match?.deadlineKey;
    }
    const deadline = deadlineKey ? allDeadlines[deadlineKey] : null;
    if (deadline && new Date(deadline) < now) locked.push(matchId);
    else valid[matchId] = pred;
  }

  if (!Object.keys(valid).length) return { statusCode: 400, body: JSON.stringify({ error: "All predictions past deadline", locked }) };

  const key = name.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  await store("predictions").setJSON(key, { id: key, name: name.trim(), predictions: valid, lockedOut: locked, submittedAt: new Date().toISOString() });

  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true, id: key, accepted: Object.keys(valid).length, locked: locked.length }) };
};
