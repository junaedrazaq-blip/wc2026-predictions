// FIFA World Cup 2026 — Complete confirmed fixture data
// BST = GMT+1. ET times from Al Jazeera/ESPN/CBS confirmed schedule.
// GMT times taken from Al Jazeera; BST = GMT + 1hr.

const MATCHDAY_DEADLINES = {
  "group-md1": "2026-06-11T18:00:00Z", // 1hr before first MD1 kick-off (19:00 GMT)
  "group-md2": "2026-06-18T16:00:00Z", // 1hr before first MD2 kick-off (17:00 GMT)
  "group-md3": "2026-06-24T22:00:00Z", // 1hr before first MD3 kick-off (23:00 GMT)
};

const KNOCKOUT_ROUND_DEADLINES = {
  "Round of 32":   "2026-06-28T22:00:00Z",
  "Round of 16":   "2026-07-04T18:00:00Z",
  "Quarter-final": "2026-07-09T18:00:00Z",
  "Semi-final":    "2026-07-14T18:00:00Z",
  "Final":         "2026-07-19T18:00:00Z",
};

// Each match: id, group, home, away, stage, matchday, date, kickoffBST, city, deadlineKey, deadline
const GROUP_MATCHES = [
  // ── GROUP A ──
  { id:"001", group:"A", home:"Mexico",       away:"South Africa", stage:"Group Stage", matchday:1, date:"2026-06-11", kickoffBST:"20:00", city:"Mexico City" },
  { id:"002", group:"A", home:"South Korea",  away:"Czechia",      stage:"Group Stage", matchday:1, date:"2026-06-11", kickoffBST:"03:00+", city:"Zapopan" },
  { id:"003", group:"A", home:"Czechia",      away:"South Africa", stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"18:00", city:"Atlanta" },
  { id:"004", group:"A", home:"Mexico",       away:"South Korea",  stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"02:00+", city:"Zapopan" },
  { id:"005", group:"A", home:"Czechia",      away:"Mexico",       stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"02:00+", city:"Mexico City" },
  { id:"006", group:"A", home:"South Africa", away:"South Korea",  stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"02:00+", city:"Guadalupe" },

  // ── GROUP B ──
  { id:"007", group:"B", home:"Canada",               away:"Bosnia and Herzegovina", stage:"Group Stage", matchday:1, date:"2026-06-12", kickoffBST:"20:00", city:"Toronto" },
  { id:"008", group:"B", home:"Qatar",                away:"Switzerland",            stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"20:00", city:"San Francisco" },
  { id:"009", group:"B", home:"Switzerland",          away:"Bosnia and Herzegovina", stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"00:00+", city:"Los Angeles" },
  { id:"010", group:"B", home:"Canada",               away:"Qatar",                  stage:"Group Stage", matchday:2, date:"2026-06-18", kickoffBST:"03:00+", city:"Vancouver" },
  { id:"011", group:"B", home:"Switzerland",          away:"Canada",                 stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"00:00+", city:"Vancouver" },
  { id:"012", group:"B", home:"Bosnia and Herzegovina", away:"Qatar",               stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"00:00+", city:"Seattle" },

  // ── GROUP C ──
  { id:"013", group:"C", home:"Brazil",   away:"Morocco",  stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"00:00+", city:"New Jersey" },
  { id:"014", group:"C", home:"Haiti",    away:"Scotland", stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"02:00+", city:"Boston" },
  { id:"015", group:"C", home:"Scotland", away:"Morocco",  stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"00:00+", city:"Boston" },
  { id:"016", group:"C", home:"Brazil",   away:"Haiti",    stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"03:00+", city:"Philadelphia" },
  { id:"017", group:"C", home:"Scotland", away:"Brazil",   stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"23:00", city:"Miami" },
  { id:"018", group:"C", home:"Morocco",  away:"Haiti",    stage:"Group Stage", matchday:3, date:"2026-06-24", kickoffBST:"23:00", city:"Atlanta" },

  // ── GROUP D ──
  { id:"019", group:"D", home:"USA",       away:"Paraguay",  stage:"Group Stage", matchday:1, date:"2026-06-12", kickoffBST:"02:00+", city:"Los Angeles" },
  { id:"020", group:"D", home:"Australia", away:"Türkiye",   stage:"Group Stage", matchday:1, date:"2026-06-13", kickoffBST:"05:00+", city:"Vancouver" },
  { id:"021", group:"D", home:"USA",       away:"Australia", stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"20:00", city:"Seattle" },
  { id:"022", group:"D", home:"Türkiye",   away:"Paraguay",  stage:"Group Stage", matchday:2, date:"2026-06-19", kickoffBST:"05:00+", city:"San Francisco" },
  { id:"023", group:"D", home:"Türkiye",   away:"USA",       stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"03:00+", city:"Los Angeles" },
  { id:"024", group:"D", home:"Paraguay",  away:"Australia", stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"03:00+", city:"San Francisco" },

  // ── GROUP E ──
  { id:"025", group:"E", home:"Germany",      away:"Curaçao",      stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"19:00", city:"Houston" },
  { id:"026", group:"E", home:"Ivory Coast",  away:"Ecuador",      stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"01:00+", city:"Philadelphia" },
  { id:"027", group:"E", home:"Germany",      away:"Ivory Coast",  stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"22:00", city:"Toronto" },
  { id:"028", group:"E", home:"Ecuador",      away:"Curaçao",      stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"05:00+", city:"Kansas City" },
  { id:"029", group:"E", home:"Ecuador",      away:"Germany",      stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"22:00", city:"New Jersey" },
  { id:"030", group:"E", home:"Curaçao",      away:"Ivory Coast",  stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"22:00", city:"Philadelphia" },

  // ── GROUP F ──
  { id:"031", group:"F", home:"Netherlands",  away:"Japan",     stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"22:00", city:"Dallas" },
  { id:"032", group:"F", home:"Sweden",       away:"Tunisia",   stage:"Group Stage", matchday:1, date:"2026-06-14", kickoffBST:"05:00+", city:"Guadalupe" },
  { id:"033", group:"F", home:"Netherlands",  away:"Sweden",    stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"20:00", city:"Houston" },
  { id:"034", group:"F", home:"Tunisia",      away:"Japan",     stage:"Group Stage", matchday:2, date:"2026-06-20", kickoffBST:"07:00+", city:"Guadalupe" },
  { id:"035", group:"F", home:"Japan",        away:"Sweden",    stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"00:00+", city:"Dallas" },
  { id:"036", group:"F", home:"Tunisia",      away:"Netherlands", stage:"Group Stage", matchday:3, date:"2026-06-25", kickoffBST:"00:00+", city:"Kansas City" },

  // ── GROUP G ──
  { id:"037", group:"G", home:"Belgium",     away:"Egypt",        stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"00:00+", city:"Vancouver" },
  { id:"038", group:"G", home:"Iran",        away:"New Zealand",  stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"06:00+", city:"Los Angeles" },
  { id:"039", group:"G", home:"Belgium",     away:"Iran",         stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"00:00+", city:"Los Angeles" },
  { id:"040", group:"G", home:"New Zealand", away:"Egypt",        stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"06:00+", city:"Vancouver" },
  { id:"041", group:"G", home:"Egypt",       away:"Iran",         stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"00:00+", city:"Seattle" },
  { id:"042", group:"G", home:"New Zealand", away:"Belgium",      stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"00:00+", city:"Vancouver" },

  // ── GROUP H ──
  { id:"043", group:"H", home:"Spain",       away:"Cape Verde",    stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"18:00", city:"Atlanta" },
  { id:"044", group:"H", home:"Saudi Arabia", away:"Uruguay",      stage:"Group Stage", matchday:1, date:"2026-06-15", kickoffBST:"00:00+", city:"Miami" },
  { id:"045", group:"H", home:"Spain",       away:"Saudi Arabia",  stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"18:00", city:"Atlanta" },
  { id:"046", group:"H", home:"Uruguay",     away:"Cape Verde",    stage:"Group Stage", matchday:2, date:"2026-06-21", kickoffBST:"00:00+", city:"Miami" },
  { id:"047", group:"H", home:"Cape Verde",  away:"Saudi Arabia",  stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"03:00+", city:"Houston" },
  { id:"048", group:"H", home:"Uruguay",     away:"Spain",         stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"03:00+", city:"Zapopan" },

  // ── GROUP I ──
  { id:"049", group:"I", home:"France",   away:"Senegal",  stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"21:00", city:"New Jersey" },
  { id:"050", group:"I", home:"Iraq",     away:"Norway",   stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"00:00+", city:"Boston" },
  { id:"051", group:"I", home:"France",   away:"Iraq",     stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"23:00", city:"Philadelphia" },
  { id:"052", group:"I", home:"Norway",   away:"Senegal",  stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"02:00+", city:"New Jersey" },
  { id:"053", group:"I", home:"Norway",   away:"France",   stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"21:00", city:"Boston" },
  { id:"054", group:"I", home:"Senegal",  away:"Iraq",     stage:"Group Stage", matchday:3, date:"2026-06-26", kickoffBST:"21:00", city:"Toronto" },

  // ── GROUP J ──
  { id:"055", group:"J", home:"Argentina", away:"Algeria",  stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"04:00+", city:"Kansas City" },
  { id:"056", group:"J", home:"Austria",   away:"Jordan",   stage:"Group Stage", matchday:1, date:"2026-06-16", kickoffBST:"09:00+", city:"San Francisco" },
  { id:"057", group:"J", home:"Argentina", away:"Austria",  stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"20:00", city:"Dallas" },
  { id:"058", group:"J", home:"Jordan",    away:"Algeria",  stage:"Group Stage", matchday:2, date:"2026-06-22", kickoffBST:"08:00+", city:"San Francisco" },
  { id:"059", group:"J", home:"Algeria",   away:"Austria",  stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"03:00+", city:"Kansas City" },
  { id:"060", group:"J", home:"Jordan",    away:"Argentina",stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"03:00+", city:"Dallas" },

  // ── GROUP K ──
  { id:"061", group:"K", home:"Portugal",    away:"DR Congo",   stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"20:00", city:"Houston" },
  { id:"062", group:"K", home:"Uzbekistan",  away:"Colombia",   stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"05:00+", city:"Mexico City" },
  { id:"063", group:"K", home:"Portugal",    away:"Uzbekistan", stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"20:00", city:"Houston" },
  { id:"064", group:"K", home:"DR Congo",    away:"Colombia",   stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"05:00+", city:"Zapopan" },
  { id:"065", group:"K", home:"Colombia",    away:"Portugal",   stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"00:30+", city:"Miami" },
  { id:"066", group:"K", home:"DR Congo",    away:"Uzbekistan", stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"00:30+", city:"Atlanta" },

  // ── GROUP L ──
  { id:"067", group:"L", home:"England",  away:"Croatia",  stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"23:00", city:"Dallas" },
  { id:"068", group:"L", home:"Ghana",    away:"Panama",   stage:"Group Stage", matchday:1, date:"2026-06-17", kickoffBST:"01:00+", city:"Toronto" },
  { id:"069", group:"L", home:"England",  away:"Ghana",    stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"22:00", city:"Boston" },
  { id:"070", group:"L", home:"Panama",   away:"Croatia",  stage:"Group Stage", matchday:2, date:"2026-06-23", kickoffBST:"01:00+", city:"Toronto" },
  { id:"071", group:"L", home:"Panama",   away:"England",  stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"23:00", city:"New Jersey" },
  { id:"072", group:"L", home:"Croatia",  away:"Ghana",    stage:"Group Stage", matchday:3, date:"2026-06-27", kickoffBST:"23:00", city:"Philadelphia" },
];

// Attach deadline info to every match
GROUP_MATCHES.forEach(m => {
  m.deadlineKey = `group-md${m.matchday}`;
  m.deadline = MATCHDAY_DEADLINES[m.deadlineKey];
});

// Note: kickoffBST values with '+' mean the match kicks off after midnight BST
// (i.e. it's technically the next calendar day in the UK)

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
