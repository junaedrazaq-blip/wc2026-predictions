const { store } = require("./_store");

exports.handler = async (event) => {
  const adminKey = process.env.ADMIN_KEY || "wc2026admin";
  if (event.queryStringParameters?.key !== adminKey) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorised" }) };

  let blobs = [];
  try { ({ blobs } = await store("predictions").list()); } catch {}

  const all = (await Promise.all(
    blobs.map(async ({ key }) => { try { return await store("predictions").get(key, { type: "json" }); } catch { return null; } })
  )).filter(Boolean);

  all.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(all) };
};
