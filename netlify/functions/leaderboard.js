const { getStore } = require("@netlify/blobs");

// Scoring rules:
//   Exact score  → 3 pts
//   Correct result (win/draw/loss) → 1 pt

function calcPoints(predicted, actual) {
  if (!predicted || !actual) return 0;
  const [ph, pa] = predicted;
  const [ah, aa] = actual;
  if (ph === ah && pa === aa) return 3;
  const predResult = ph > pa ? "H" : ph < pa ? "A" : "D";
  const actResult = ah > aa ? "H" : ah < aa ? "A" : "D";
  if (predResult === actResult) return 1;
  return 0;
}

exports.handler = async (event) => {
  const adminKey = process.env.ADMIN_KEY || "wc2026admin";

  if (event.httpMethod === "POST") {
    // Admin: set a result
    const { key: provided } = JSON.parse(event.body || "{}");
    if (provided !== adminKey) {
      return { statusCode: 401, body: "Unauthorised" };
    }

    const { matchId, homeScore, awayScore } = JSON.parse(event.body);
    const resultsStore = getStore("results");
    await resultsStore.setJSON(matchId, { home: homeScore, away: awayScore });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  // GET: compute leaderboard
  const [resultsStore, predictionsStore] = [getStore("results"), getStore("predictions")];

  const [{ blobs: resultBlobs }, { blobs: predBlobs }] = await Promise.all([
    resultsStore.list(),
    predictionsStore.list(),
  ]);

  const results = {};
  await Promise.all(
    resultBlobs.map(async ({ key }) => {
      results[key] = await resultsStore.get(key, { type: "json" });
    })
  );

  const allPredictions = await Promise.all(
    predBlobs.map((b) => predictionsStore.get(b.key, { type: "json" }))
  );

  const leaderboard = allPredictions.map((entry) => {
    let total = 0;
    let exact = 0;
    let correct = 0;

    for (const [matchId, pred] of Object.entries(entry.predictions || {})) {
      const actual = results[matchId];
      if (!actual) continue;
      const pts = calcPoints([pred.home, pred.away], [actual.home, actual.away]);
      total += pts;
      if (pts === 3) exact++;
      else if (pts === 1) correct++;
    }

    return {
      name: entry.name,
      id: entry.id,
      total,
      exact,
      correct,
      submittedAt: entry.submittedAt,
    };
  });

  leaderboard.sort((a, b) => b.total - a.total || b.exact - a.exact);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaderboard, results }),
  };
};
