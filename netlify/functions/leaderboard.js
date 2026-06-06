const { store } = require("./_store");

function calcPoints(predicted, actual) {
  if (!predicted || !actual) return 0;
  const [ph, pa] = predicted;
  const [ah, aa] = actual;
  if (ph === ah && pa === aa) return 3;
  const predResult = ph > pa ? "H" : ph < pa ? "A" : "D";
  const actResult  = ah > aa ? "H" : ah < aa ? "A" : "D";
  return predResult === actResult ? 1 : 0;
}

exports.handler = async (event) => {
  const adminKey = process.env.ADMIN_KEY || "wc2026admin";

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}");
    if (body.key !== adminKey) return { statusCode: 401, body: "Unauthorised" };
    const { matchId, homeScore, awayScore } = body;
    await store("results").setJSON(matchId, { home: homeScore, away: awayScore });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  // GET — verify admin key then return leaderboard
  const provided = event.queryStringParameters?.key;
  if (provided !== adminKey) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorised" }) };

  const resultsStore     = store("results");
  const predictionsStore = store("predictions");

  let resultBlobs = [], predBlobs = [];
  try { ({ blobs: resultBlobs }     = await resultsStore.list()); }     catch {}
  try { ({ blobs: predBlobs }       = await predictionsStore.list()); } catch {}

  const results = {};
  await Promise.all(resultBlobs.map(async ({ key }) => {
    try { results[key] = await resultsStore.get(key, { type: "json" }); } catch {}
  }));

  const allPredictions = (await Promise.all(
    predBlobs.map(async b => { try { return await predictionsStore.get(b.key, { type: "json" }); } catch { return null; } })
  )).filter(Boolean);

  const leaderboard = allPredictions.map(entry => {
    let total = 0, exact = 0, correct = 0;
    for (const [matchId, pred] of Object.entries(entry.predictions || {})) {
      const actual = results[matchId];
      if (!actual) continue;
      const pts = calcPoints([pred.home, pred.away], [actual.home, actual.away]);
      total += pts;
      if (pts === 3) exact++; else if (pts === 1) correct++;
    }
    return { name: entry.name, id: entry.id, total, exact, correct, submittedAt: entry.submittedAt };
  });

  leaderboard.sort((a, b) => b.total - a.total || b.exact - a.exact);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaderboard, results }),
  };
};
