const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  // Simple passphrase protection – set ADMIN_KEY env var in Netlify dashboard
  const adminKey = process.env.ADMIN_KEY || "wc2026admin";
  const provided = event.queryStringParameters?.key;

  if (provided !== adminKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorised" }),
    };
  }

  const store = getStore("predictions");
  const { blobs } = await store.list();

  const allPredictions = await Promise.all(
    blobs.map(async ({ key }) => {
      const val = await store.get(key, { type: "json" });
      return val;
    })
  );

  // Sort newest first
  allPredictions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(allPredictions),
  };
};
