// Shared helper — passes siteID + token explicitly so Blobs works in all environments
const { getStore } = require("@netlify/blobs");

function store(name) {
  return getStore({
    name,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
}

module.exports = { store };
