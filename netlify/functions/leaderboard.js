const { store } = require("./_store");
const { GROUP_MATCHES } = require("./matches-data");
const { writeSnapshotTab } = require("./_sheets");

// Map from deadlineKey → snapshot tab name
const SNAPSHOT_TAB_NAMES = {
  "group-md1":    "MD1 Snapshot",
  "group-md2":    "MD2 Snapshot",
  "group-md3":    "MD3 Snapshot",
  "Round of 32":  "R32 Snapshot",
  "Round of 16":  "R16 Snapshot",
  "Quarter-final":"QF Snapshot",
  "Semi-final":   "SF Snapshot",
  "Final":        "Final Snapshot",
};

function calcPoints(predicted, actual) {
  if (!predicted || !actual) return 0;
  const [ph, pa] = predicted;
  const [ah, aa] = actual;
  if (ph === ah && pa === aa) return 3;
  const predResult = ph > pa ? "H" : ph < pa ? "A" : "D";
  const actResult  = ah > aa ? "H" : ah < aa ? "A" : "D";
  return predResult === actResult ? 1 : 0;
}

function calcBonusPoints(entry, bonusAnswers) {
  let pts = 0;
  if (!bonusAnswers) return { pts, winnerCorrect: false, bootCorrect: false };
  const bonus = entry.bonus || {};
  const winnerCorrect = bonusAnswers.winner && bonus.winner &&
    bonus.winner.trim().toLowerCase() === bonusAnswers.winner.trim().toLowerCase();
  const bootCorrect = bonusAnswers.boot && bonus.boot &&
    bonus.boot.trim().toLowerCase() === bonusAnswers.boot.trim().toLowerCase();
  if (winnerCorrect) pts += 10;
  if (bootCorrect)   pts += 10;
  return { pts, winnerCorrect, bootCorrect };
}

// Work out which deadlineKey a matchId belongs to
function getDeadlineKey(matchId, knockoutFixtures) {
  const groupMatch = GROUP_MATCHES.find(m => m.id === matchId);
  if (groupMatch) return groupMatch.deadlineKey;
  const koMatch = (knockoutFixtures || []).find(m => m.id === matchId);
  if (koMatch) return koMatch.deadlineKey || koMatch.stage;
  return null;
}

exports.handler = async (event) => {
  const adminKey = process.env.ADMIN_KEY || "wc2026admin";

  // ── POST: save a result, then trigger snapshot if first result for that round ──
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}");
    if (body.key !== adminKey) return { statusCode: 401, body: "Unauthorised" };
    const { matchId, homeScore, awayScore } = body;

    const resultsStore     = store("results");
    const predictionsStore = store("predictions");
    const configStore      = store("config");

    // Save the result
    await resultsStore.setJSON(matchId, { home: homeScore, away: awayScore });

    // Check if this is the first result for this round → trigger snapshot
    try {
      let knockoutFixtures = [];
      try { knockoutFixtures = (await configStore.get("knockout-fixtures", { type: "json" })) || []; } catch {}

      const deadlineKey = getDeadlineKey(matchId, knockoutFixtures);
      const tabName = deadlineKey ? SNAPSHOT_TAB_NAMES[deadlineKey] : null;

      if (tabName) {
        // Get all match IDs that belong to this round
        const roundMatchIds = [
          ...GROUP_MATCHES.filter(m => m.deadlineKey === deadlineKey).map(m => m.id),
          ...knockoutFixtures.filter(m => (m.deadlineKey || m.stage) === deadlineKey).map(m => m.id),
        ];

        // Check if we have any prior results for this round (other than the one just saved)
        let { blobs: resultBlobs } = await resultsStore.list();
        const priorResultsForRound = resultBlobs.filter(b =>
          b.key !== matchId && roundMatchIds.includes(b.key)
        );

        // Only snapshot on the FIRST result for the round
        if (priorResultsForRound.length === 0) {
          // Load all predictions
          let { blobs: predBlobs } = await predictionsStore.list();
          const allPredictions = (await Promise.all(
            predBlobs.map(async b => {
              try { return await predictionsStore.get(b.key, { type: "json" }); } catch { return null; }
            })
          )).filter(Boolean);

          // All matches for display info
          const allMatches = [...GROUP_MATCHES, ...knockoutFixtures];

          // Fire-and-forget — don't await so we don't slow down the result save response
          writeSnapshotTab(tabName, allPredictions, roundMatchIds, allMatches)
            .catch(err => console.error("Snapshot error:", err));
        }
      }
    } catch (err) {
      // Non-fatal — result is already saved, snapshot failure shouldn't block the admin
      console.error("Snapshot trigger error:", err);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  // ── GET: public leaderboard — key param used only for admin login verification ──
  const provided = event.queryStringParameters?.key;
  // If a key was supplied (admin login check) verify it — otherwise allow public access
  if (provided && provided !== adminKey) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorised" }) };
  }

  const resultsStore     = store("results");
  const predictionsStore = store("predictions");
  const configStore      = store("config");

  let resultBlobs = [], predBlobs = [];
  try { ({ blobs: resultBlobs }  = await resultsStore.list()); }     catch {}
  try { ({ blobs: predBlobs }    = await predictionsStore.list()); } catch {}

  const results = {};
  await Promise.all(resultBlobs.map(async ({ key }) => {
    try { results[key] = await resultsStore.get(key, { type: "json" }); } catch {}
  }));

  let bonusAnswers = null;
  try { bonusAnswers = await configStore.get("bonus-answers", { type: "json" }); } catch {}

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
    const { pts: bonusPts, winnerCorrect, bootCorrect } = calcBonusPoints(entry, bonusAnswers);
    total += bonusPts;
    return {
      name: entry.name, id: entry.id, total, exact, correct,
      bonusWinner: winnerCorrect ? entry.bonus?.winner : null,
      bonusBoot:   bootCorrect   ? entry.bonus?.boot   : null,
      bonusGoals:  entry.bonus?.goals,
      submittedAt: entry.submittedAt,
    };
  });

  const actualGoals = bonusAnswers?.goals;
  leaderboard.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.exact !== a.exact) return b.exact - a.exact;
    if (actualGoals !== undefined && actualGoals !== null) {
      const da = Math.abs((a.bonusGoals ?? Infinity) - actualGoals);
      const db = Math.abs((b.bonusGoals ?? Infinity) - actualGoals);
      return da - db;
    }
    return 0;
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaderboard, results, bonusAnswers }),
  };
};
