// Admin-only function: add knockout fixtures, update deadlines
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const adminKey = process.env.ADMIN_KEY || "wc2026admin";
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Bad JSON" }; }

  if (body.key !== adminKey) return { statusCode: 401, body: "Unauthorised" };

  const store = getStore("config");
  const { action } = body;

  // ── ADD / UPDATE KNOCKOUT FIXTURE ──
  if (action === "add-knockout-fixture") {
    const { id, home, away, stage, date, deadlineKey, deadline } = body.fixture;
    if (!id || !home || !away || !stage) return { statusCode: 400, body: "Missing fixture fields" };

    let fixtures = [];
    try { fixtures = (await store.get("knockout-fixtures", { type: "json" })) || []; } catch {}

    const existingIdx = fixtures.findIndex(f => f.id === id);
    const fixture = { id, home, away, stage, date, deadlineKey, deadline, addedAt: new Date().toISOString() };
    if (existingIdx >= 0) fixtures[existingIdx] = fixture;
    else fixtures.push(fixture);

    await store.setJSON("knockout-fixtures", fixtures);
    return { statusCode: 200, body: JSON.stringify({ ok: true, fixtures }) };
  }

  // ── UPDATE DEADLINE ──
  if (action === "update-deadline") {
    const { key, datetime } = body;
    if (!key || !datetime) return { statusCode: 400, body: "Missing key or datetime" };

    let overrides = {};
    try { overrides = (await store.get("deadline-overrides", { type: "json" })) || {}; } catch {}
    overrides[key] = datetime;
    await store.setJSON("deadline-overrides", overrides);
    return { statusCode: 200, body: JSON.stringify({ ok: true, overrides }) };
  }

  // ── DELETE KNOCKOUT FIXTURE ──
  if (action === "delete-knockout-fixture") {
    const { id } = body;
    let fixtures = [];
    try { fixtures = (await store.get("knockout-fixtures", { type: "json" })) || []; } catch {}
    fixtures = fixtures.filter(f => f.id !== id);
    await store.setJSON("knockout-fixtures", fixtures);
    return { statusCode: 200, body: JSON.stringify({ ok: true, fixtures }) };
  }

  return { statusCode: 400, body: "Unknown action" };
};
