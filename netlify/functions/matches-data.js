// FIFA World Cup 2026 — Complete confirmed fixture data
// Source: User-provided official schedule with BST kick-off times
// * city names normalised for display

const MATCHDAY_DEADLINES = {
  "group-md1": "2026-06-11T18:00:00Z",
  "group-md2": "2026-06-18T15:00:00Z",
  "group-md3": "2026-06-24T18:00:00Z",
};

const KNOCKOUT_ROUND_DEADLINES = {
  "Round of 32":   "2026-06-28T22:00:00Z",
  "Round of 16":   "2026-07-04T18:00:00Z",
  "Quarter-final": "2026-07-09T18:00:00Z",
  "Semi-final":    "2026-07-14T18:00:00Z",
  "Final":         "2026-07-19T18:00:00Z",
};

const GROUP_MATCHES = [
  // ── MATCHDAY 1 ──
  { id:"001", group:"A", home:"Mexico",                 away:"South Africa",        stage:"Group Stage", matchday:1, date:"2026-06-11", kickoffBST:"20:00",  city:"Mexico City" },
  { id:"002", group:"A", home:"South Korea",          away:"Czechia",             stage:"Group Stage", matchday:1, date:"2026-06-12", kickoffBST:"03:00",  city:"Guadalajara" },
  { id:"003", group:"B", home:"Canada",                  away:"Bosnia and Herzegovina", stage:"Group Stage", matchday:1, date:"2026-06-12", kickoffBST:"20:00",  city:"Toronto" },
  { id:"004", group:"D", home:"USA",                     away:"Paraguay",            stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"02:00",  city:"Los Angeles" },
  { id:"005", group:"B", home:"Qatar",                   away:"Switzerland",         stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"20:00",  city:"San Francisco" },
  { id:"006", group:"C", home:"Brazil",                  away:"Morocco",             stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"23:00",  city:"New Jersey" },
  { id:"007", group:"C", home:"Haiti",                   away:"Scotland",            stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"02:00",  city:"Boston" },
  { id:"008", group:"D", home:"Australia",               away:"Türkiye",             stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"05:00",  city:"Vancouver" },
  { id:"009", group:"E", home:"Germany",                 away:"Curaçao",             stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"18:00",  city:"Houston" },
  { id:"010", group:"F", home:"Netherlands",             away:"Japan",               stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"21:00",  city:"Dallas" },
  { id:"011", group:"E", home:"Ivory Coast",             away:"Ecuador",             stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"00:00",  city:"Philadelphia" },
  { id:"012", group:"F", home:"Sweden",                  away:"Tunisia",             stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"03:00",  city:"Monterrey" },
  { id:"013", group:"H", home:"Spain",                   away:"Cape Verde",          stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"17:00",  city:"Atlanta" },
  { id:"014", group:"G", home:"Belgium",                 away:"Egypt",               stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"20:00",  city:"Seattle" },
  { id:"015", group:"H", home:"Saudi Arabia",            away:"Uruguay",             stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"23:00",  city:"Miami" },
  { id:"016", group:"G", home:"Iran",                    away:"New Zealand",         stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"02:00",  city:"Los Angeles" },
  { id:"017", group:"I", home:"France",                  away:"Senegal",             stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"20:00",  city:"New Jersey" },
  { id:"018", group:"I", home:"Iraq",                    away:"Norway",              stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"23:00",  city:"Boston" },
  { id:"019", group:"J", home:"Argentina",               away:"Algeria",             stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"02:00",  city:"Kansas City" },
  { id:"020", group:"J", home:"Austria",                 away:"Jordan",              stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"05:00",  city:"San Francisco" },
  { id:"021", group:"K", home:"Portugal",                away:"DR Congo",            stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"18:00",  city:"Houston" },
  { id:"022", group:"L", home:"England",                 away:"Croatia",             stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"21:00",  city:"Dallas" },
  { id:"023", group:"L", home:"Ghana",                   away:"Panama",              stage:"Group Stage", matchday:1, date:"2026-06-18", kickoffBST:"00:00",  city:"Toronto" },
  { id:"024", group:"K", home:"Uzbekistan",              away:"Colombia",            stage:"Group Stage", matchday:1, date:"2026-06-18", kickoffBST:"03:00",  city:"Mexico City" },

  // ── MATCHDAY 2 ──
  { id:"025", group:"A", home:"Czechia",                 away:"South Africa",        stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"17:00",  city:"Atlanta" },
  { id:"026", group:"B", home:"Switzerland",             away:"Bosnia and Herzegovina", stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"20:00",  city:"Los Angeles" },
  { id:"027", group:"B", home:"Canada",                  away:"Qatar",               stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"23:00",  city:"Vancouver" },
  { id:"028", group:"A", home:"Mexico",                  away:"South Korea",       stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"02:00",  city:"Guadalajara" },
  { id:"029", group:"D", home:"USA",                     away:"Australia",           stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"20:00",  city:"Seattle" },
  { id:"030", group:"C", home:"Scotland",                away:"Morocco",             stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"23:00",  city:"Boston" },
  { id:"031", group:"C", home:"Brazil",                  away:"Haiti",               stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"02:00",  city:"Philadelphia" },
  { id:"032", group:"D", home:"Türkiye",                 away:"Paraguay",            stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"05:00",  city:"San Francisco" },
  { id:"033", group:"F", home:"Netherlands",             away:"Sweden",              stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"18:00",  city:"Houston" },
  { id:"034", group:"E", home:"Germany",                 away:"Ivory Coast",         stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"21:00",  city:"Toronto" },
  { id:"035", group:"E", home:"Ecuador",                 away:"Curaçao",             stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"01:00",  city:"Kansas City" },
  { id:"036", group:"F", home:"Tunisia",                 away:"Japan",               stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"05:00",  city:"Monterrey" },
  { id:"037", group:"H", home:"Spain",                   away:"Saudi Arabia",        stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"17:00",  city:"Atlanta" },
  { id:"038", group:"G", home:"Belgium",                 away:"Iran",                stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"20:00",  city:"Los Angeles" },
  { id:"039", group:"H", home:"Uruguay",                 away:"Cape Verde",          stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"23:00",  city:"Miami" },
  { id:"040", group:"G", home:"New Zealand",             away:"Egypt",               stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"02:00",  city:"Vancouver" },
  { id:"041", group:"J", home:"Argentina",               away:"Austria",             stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"18:00",  city:"Dallas" },
  { id:"042", group:"I", home:"France",                  away:"Iraq",                stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"22:00",  city:"Philadelphia" },
  { id:"043", group:"I", home:"Norway",                  away:"Senegal",             stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"01:00",  city:"New Jersey" },
  { id:"044", group:"J", home:"Jordan",                  away:"Algeria",             stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"04:00",  city:"San Francisco" },
  { id:"045", group:"K", home:"Portugal",                away:"Uzbekistan",          stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"18:00",  city:"Houston" },
  { id:"046", group:"L", home:"England",                 away:"Ghana",               stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"21:00",  city:"Boston" },
  { id:"047", group:"L", home:"Panama",                  away:"Croatia",             stage:"Group Stage", matchday:2, date:"2026-06-24", kickoffBST:"00:00",  city:"Toronto" },
  { id:"048", group:"K", home:"Colombia",                away:"DR Congo",            stage:"Group Stage", matchday:2, date:"2026-06-24", kickoffBST:"03:00",  city:"Guadalajara" },

  // ── MATCHDAY 3 ──
  { id:"049", group:"B", home:"Switzerland",             away:"Canada",              stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"20:00",  city:"Vancouver" },
  { id:"050", group:"B", home:"Bosnia and Herzegovina",  away:"Qatar",               stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"20:00",  city:"Seattle" },
  { id:"051", group:"C", home:"Scotland",                away:"Brazil",              stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"23:00",  city:"Miami" },
  { id:"052", group:"C", home:"Morocco",                 away:"Haiti",               stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"23:00",  city:"Atlanta" },
  { id:"053", group:"A", home:"Czechia",                 away:"Mexico",              stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"02:00",  city:"Mexico City" },
  { id:"054", group:"A", home:"South Africa",            away:"South Korea",      stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"02:00",  city:"Monterrey" },
  { id:"055", group:"E", home:"Curaçao",                 away:"Ivory Coast",         stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"21:00",  city:"Philadelphia" },
  { id:"056", group:"E", home:"Ecuador",                 away:"Germany",             stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"21:00",  city:"New Jersey" },
  { id:"057", group:"F", home:"Japan",                   away:"Sweden",              stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"00:00",  city:"Dallas" },
  { id:"058", group:"F", home:"Tunisia",                 away:"Netherlands",         stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"00:00",  city:"Kansas City" },
  { id:"059", group:"D", home:"Türkiye",                 away:"USA",                 stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"03:00",  city:"Los Angeles" },
  { id:"060", group:"D", home:"Paraguay",                away:"Australia",           stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"03:00",  city:"San Francisco" },
  { id:"061", group:"I", home:"Norway",                  away:"France",              stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"20:00",  city:"Boston" },
  { id:"062", group:"I", home:"Senegal",                 away:"Iraq",                stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"20:00",  city:"Toronto" },
  { id:"063", group:"H", home:"Cape Verde",              away:"Saudi Arabia",        stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"01:00",  city:"Houston" },
  { id:"064", group:"H", home:"Uruguay",                 away:"Spain",               stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"01:00",  city:"Guadalajara" },
  { id:"065", group:"G", home:"Egypt",                   away:"Iran",                stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"04:00",  city:"Seattle" },
  { id:"066", group:"G", home:"New Zealand",             away:"Belgium",             stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"04:00",  city:"Vancouver" },
  { id:"067", group:"L", home:"Panama",                  away:"England",             stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"22:00",  city:"New Jersey" },
  { id:"068", group:"L", home:"Croatia",                 away:"Ghana",               stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"22:00",  city:"Philadelphia" },
  { id:"069", group:"K", home:"Colombia",                away:"Portugal",            stage:"Group Stage", matchday:3, date:"2026-06-28", kickoffBST:"00:30",  city:"Miami" },
  { id:"070", group:"K", home:"DR Congo",                away:"Uzbekistan",          stage:"Group Stage", matchday:3, date:"2026-06-28", kickoffBST:"00:30",  city:"Atlanta" },
  { id:"071", group:"J", home:"Algeria",                 away:"Austria",             stage:"Group Stage", matchday:3, date:"2026-06-28", kickoffBST:"03:00",  city:"Kansas City" },
  { id:"072", group:"J", home:"Jordan",                  away:"Argentina",           stage:"Group Stage", matchday:3, date:"2026-06-28", kickoffBST:"03:00",  city:"Dallas" },
];

GROUP_MATCHES.forEach(m => {
  m.deadlineKey = `group-md${m.matchday}`;
  m.deadline = MATCHDAY_DEADLINES[m.deadlineKey];
});

const GROUPS = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

module.exports = { GROUPS, GROUP_MATCHES, MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES };
