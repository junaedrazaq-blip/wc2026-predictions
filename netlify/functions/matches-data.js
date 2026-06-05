// FIFA World Cup 2026 — Fixture & Deadline Data
// Deadlines are set to 1 hour before the EARLIEST kick-off in each matchday/round.
// All times UTC. Group stage MD1 kick-offs begin ~00:00 UTC (19:00 ET prev day).
// Knockout deadlines are set by admin when fixture is created.

const GROUPS = {
  A: ["Mexico", "South Africa", "Korea Republic", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Japan", "Iran", "Algeria"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Saudi Arabia", "Belgium", "Uruguay"],
  F: ["Morocco", "Ukraine", "Iraq", "Sweden"],
  G: ["Netherlands", "Senegal", "Slovenia", "New Zealand"],
  H: ["Spain", "Serbia", "Uzbekistan", "New Caledonia"],
  I: ["France", "Nigeria", "Cameroon", "Jordan"],
  J: ["Argentina", "Ivory Coast", "Denmark", "Peru"],
  K: ["Portugal", "Poland", "Ecuador", "Indonesia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

// Matchday date ranges (first kick-off per matchday, UTC)
// MD1: Jun 11–16, MD2: Jun 17–21, MD3: Jun 22–26
// Deadlines = 1hr before first match of that matchday
const MATCHDAY_DEADLINES = {
  "group-md1": "2026-06-11T22:00:00Z", // 1hr before first MD1 kick-off
  "group-md2": "2026-06-17T22:00:00Z", // 1hr before first MD2 kick-off
  "group-md3": "2026-06-22T22:00:00Z", // 1hr before first MD3 kick-off (pairs play simultaneously)
};

// Approximate dates per group per matchday
const GROUP_MATCHDAY_DATES = {
  A: { 1: "2026-06-11", 2: "2026-06-17", 3: "2026-06-25" },
  B: { 1: "2026-06-12", 2: "2026-06-17", 3: "2026-06-25" },
  C: { 1: "2026-06-12", 2: "2026-06-18", 3: "2026-06-26" },
  D: { 1: "2026-06-12", 2: "2026-06-18", 3: "2026-06-26" },
  E: { 1: "2026-06-13", 2: "2026-06-19", 3: "2026-06-23" },
  F: { 1: "2026-06-13", 2: "2026-06-19", 3: "2026-06-23" },
  G: { 1: "2026-06-14", 2: "2026-06-20", 3: "2026-06-24" },
  H: { 1: "2026-06-14", 2: "2026-06-20", 3: "2026-06-24" },
  I: { 1: "2026-06-15", 2: "2026-06-21", 3: "2026-06-22" },
  J: { 1: "2026-06-15", 2: "2026-06-21", 3: "2026-06-22" },
  K: { 1: "2026-06-16", 2: "2026-06-21", 3: "2026-06-26" },
  L: { 1: "2026-06-16", 2: "2026-06-21", 3: "2026-06-26" },
};

// Knockout round deadlines (admin can override via Blobs)
const KNOCKOUT_ROUND_DEADLINES = {
  "Round of 32":  "2026-06-28T22:00:00Z",
  "Round of 16":  "2026-07-03T22:00:00Z",
  "Quarter-final":"2026-07-08T22:00:00Z",
  "Semi-final":   "2026-07-13T22:00:00Z",
  "Final":        "2026-07-18T22:00:00Z",
};

function generateGroupMatches() {
  const matches = [];
  let id = 1;
  for (const [group, teams] of Object.entries(GROUPS)) {
    const pairs = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
    pairs.forEach(([a, b], i) => {
      const matchday = Math.floor(i / 2) + 1;
      const deadlineKey = `group-md${matchday}`;
      matches.push({
        id: String(id++).padStart(3, "0"),
        group,
        home: teams[a],
        away: teams[b],
        stage: "Group Stage",
        matchday,
        date: GROUP_MATCHDAY_DATES[group][matchday],
        deadlineKey,
        deadline: MATCHDAY_DEADLINES[deadlineKey],
      });
    });
  }
  return matches;
}

const GROUP_MATCHES = generateGroupMatches();

module.exports = { GROUPS, GROUP_MATCHES, MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES };
