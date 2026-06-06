const { store } = require("./_store");
const { MATCHDAY_DEADLINES, KNOCKOUT_ROUND_DEADLINES, GROUP_MATCHES } = require("./matches-data");

const SHEET_ID = "1ELfBkJlUpBr2TuHYuztsHxGVk9-j6Pv-cnxipVCK1EA";
const CLIENT_EMAIL = "wc2026predictionapiservice@wc2026predictionproject.iam.gserviceaccount.com";

async function getAccessToken() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = { iss: CLIENT_EMAIL, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const signingInput = `${encode(header)}.${encode(claim)}`;
  const keyData = privateKey.replace("-----BEGIN RSA PRIVATE KEY-----","").replace("-----END RSA PRIVATE KEY-----","").replace("-----BEGIN PRIVATE KEY-----","").replace("-----END PRIVATE KEY-----","").replace(/\s/g,"");
  const cryptoKey = await crypto.subtle.importKey("pkcs8", Buffer.from(keyData,"base64"), { name:"RSASSA-PKCS1-v1_5", hash:"SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, Buffer.from(signingInput));
  const jwt = `${signingInput}.${Buffer.from(signature).toString("base64url")}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}` });
  return (await tokenRes.json()).access_token;
}

async function appendToSheet(rows) {
  try {
    const token = await getAccessToken();
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: rows }),
    });
  } catch (err) { console.error("Sheets append failed:", err); }
}

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
  await appendToSheet(rows);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true, id: key, accepted: Object.keys(valid).length, locked: locked.length }),
  };
};
