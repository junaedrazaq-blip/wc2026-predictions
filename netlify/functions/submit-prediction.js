const { store } = require("./_store");
const { MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES, GROUP_MATCHES } = require("./matches-data");
const { appendToSheet } = require("./_sheets");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Invalid JSON" }; }

  const { name, predictions, bonus = {} } = body;
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

  // Filter locked match predictions
  const valid = {}, locked = [];
  for (const [matchId, pred] of Object.entries(predictions)) {
    if (pred.home === undefined || pred.away === undefined) continue;
    let deadlineKey;
    if (matchId.startsWith("ko-")) deadlineKey = knockoutDeadlineMap[matchId];
    else { const match = GROUP_MATCHES.find(m => m.id === matchId); deadlineKey = match?.deadlineKey; }
    const deadline = deadlineKey ? allDeadlines[deadlineKey] : null;
    if (deadline && new Date(deadline) < now) locked.push(matchId);
    else valid[matchId] = pred;
  }

  // Filter bonus if MD1 deadline passed
  const md1Deadline = allDeadlines["group-md1"];
  const bonusLocked = md1Deadline && new Date(md1Deadline) < now;
  const validBonus = bonusLocked ? {} : bonus;

  if (!Object.keys(valid).length && !validBonus.winner && !validBonus.boot && validBonus.goals === undefined) {
    return { statusCode: 400, body: JSON.stringify({ error: "All predictions past deadline", locked }) };
  }

  const key = name.trim().toLowerCase().replace(/\s+/g, "-");
  const timestamp = new Date().toISOString();

  await store("predictions").setJSON(key, {
    id: key, name: name.trim(),
    predictions: valid,
    bonus: validBonus,
    lockedOut: locked,
    submittedAt: timestamp,
  });

  // Build sheet rows — match predictions + one bonus summary row
  const rows = Object.entries(valid).map(([matchId, pred]) => [
    timestamp, name.trim(), matchId, pred.home, pred.away, "", "", ""
  ]);
  // Bonus row
  if (validBonus.winner || validBonus.boot || validBonus.goals !== undefined) {
    rows.push([timestamp, name.trim(), "BONUS", "", "", validBonus.winner || "", validBonus.boot || "", validBonus.goals ?? ""]);
  }
  await appendToSheet("Submissions", rows);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true, id: key, accepted: Object.keys(valid).length, locked: locked.length }),
  };
};
