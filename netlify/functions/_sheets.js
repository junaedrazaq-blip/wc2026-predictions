// Shared Google Sheets helper
const SHEET_ID    = "1ELfBkJlUpBr2TuHYuztsHxGVk9-j6Pv-cnxipVCK1EA";
const CLIENT_EMAIL = "wc2026predictionapiservice@wc2026predictionproject.iam.gserviceaccount.com";

async function getAccessToken() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim  = { iss: CLIENT_EMAIL, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const signingInput = `${encode(header)}.${encode(claim)}`;
  const keyData = privateKey
    .replace("-----BEGIN RSA PRIVATE KEY-----","").replace("-----END RSA PRIVATE KEY-----","")
    .replace("-----BEGIN PRIVATE KEY-----","").replace("-----END PRIVATE KEY-----","")
    .replace(/\s/g,"");
  const cryptoKey = await crypto.subtle.importKey("pkcs8", Buffer.from(keyData,"base64"), { name:"RSASSA-PKCS1-v1_5", hash:"SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, Buffer.from(signingInput));
  const jwt = `${signingInput}.${Buffer.from(signature).toString("base64url")}`;
  const res = await fetch("https://oauth2.googleapis.com/token", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}` });
  return (await res.json()).access_token;
}

// Append rows to a named sheet tab (creates tab if it doesn't exist)
async function appendToSheet(tabName, rows) {
  try {
    const token = await getAccessToken();
    const range = `${tabName}!A1`;
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: rows }),
    });
  } catch (err) { console.error(`Sheets append to ${tabName} failed:`, err); }
}

// Check whether a sheet tab already exists
async function sheetTabExists(token, tabName) {
  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties.title`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return (data.sheets || []).some(s => s.properties.title === tabName);
  } catch { return false; }
}

// Create a new sheet tab with a header row
async function createSheetTab(token, tabName, headers) {
  try {
    // Add the sheet
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tabName } } }] }),
    });
    // Write header row
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tabName + "!A1")}?valueInputOption=USER_ENTERED`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [headers] }),
    });
  } catch (err) { console.error(`Failed to create sheet tab ${tabName}:`, err); }
}

// Write a snapshot of all predictions for a given round to a new sheet tab.
// Skips silently if the tab already exists (idempotent).
async function writeSnapshotTab(tabName, allPredictions, matchIds, matches) {
  try {
    const token = await getAccessToken();
    const exists = await sheetTabExists(token, tabName);
    if (exists) return; // already snapshotted — don't overwrite

    const headers = ["Name", "Match ID", "Home Team", "Away Team", "Home Pred", "Away Pred", "Submitted At"];
    await createSheetTab(token, tabName, headers);

    // Build a lookup of matchId → match info
    const matchMap = {};
    (matches || []).forEach(m => { matchMap[m.id] = m; });

    const rows = [];
    for (const entry of allPredictions) {
      for (const matchId of matchIds) {
        const pred = (entry.predictions || {})[matchId];
        if (pred === undefined) continue;
        const m = matchMap[matchId] || {};
        rows.push([
          entry.name,
          matchId,
          m.home || "",
          m.away || "",
          pred.home ?? "",
          pred.away ?? "",
          entry.submittedAt || "",
        ]);
      }
    }

    if (rows.length > 0) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tabName + "!A2")}?valueInputOption=USER_ENTERED`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: rows }),
      });
    }
    console.log(`Snapshot written: ${tabName} (${rows.length} rows)`);
  } catch (err) { console.error(`Snapshot failed for ${tabName}:`, err); }
}

module.exports = { appendToSheet, writeSnapshotTab };
