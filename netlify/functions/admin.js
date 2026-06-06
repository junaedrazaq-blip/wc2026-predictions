const { store } = require("./_store");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Bad JSON" }; }

  const adminKey = process.env.ADMIN_KEY || "wc2026admin";
  if (body.key !== adminKey) return { statusCode: 401, body: "Unauthorised" };

  const cfg = store("config");
  const { action } = body;

  if (action === "add-knockout-fixture") {
    const { id, home, away, stage, date, deadlineKey, deadline } = body.fixture;
    if (!id || !home || !away || !stage) return { statusCode: 400, body: "Missing fixture fields" };
    let fixtures = [];
    try { fixtures = (await cfg.get("knockout-fixtures", { type: "json" })) || []; } catch {}
    const idx = fixtures.findIndex(f => f.id === id);
    const fixture = { id, home, away, stage, date, deadlineKey, deadline, addedAt: new Date().toISOString() };
    if (idx >= 0) fixtures[idx] = fixture; else fixtures.push(fixture);
    await cfg.setJSON("knockout-fixtures", fixtures);
    return { statusCode: 200, body: JSON.stringify({ ok: true, fixtures }) };
  }

  if (action === "update-deadline") {
    const { deadlineKey, datetime } = body;
    const key = deadlineKey;
    if (!key || !datetime) return { statusCode: 400, body: "Missing key or datetime" };
    let overrides = {};
    try { overrides = (await cfg.get("deadline-overrides", { type: "json" })) || {}; } catch {}
    overrides[key] = datetime;
    await cfg.setJSON("deadline-overrides", overrides);
    return { statusCode: 200, body: JSON.stringify({ ok: true, overrides }) };
  }

  if (action === "delete-knockout-fixture") {
    let fixtures = [];
    try { fixtures = (await cfg.get("knockout-fixtures", { type: "json" })) || []; } catch {}
    fixtures = fixtures.filter(f => f.id !== body.id);
    await cfg.setJSON("knockout-fixtures", fixtures);
    return { statusCode: 200, body: JSON.stringify({ ok: true, fixtures }) };
  }

  if (action === "set-bonus-answers") {
    const { winner, boot, goals } = body;
    await cfg.setJSON("bonus-answers", { winner: winner || null, boot: boot || null, goals: goals ?? null });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 400, body: "Unknown action" };
};
