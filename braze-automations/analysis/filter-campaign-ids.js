// transformIds.js
const fs = require("fs");

// Load the campaigns.json you already have
const data = JSON.parse(fs.readFileSync("campaign-list-last-100.json"));

// Extract IDs
const campaignIds = data.campaigns.map((c) => c.id);

// Save as a JS file
const output = `const campaignIds = ${JSON.stringify(
  campaignIds,
  null,
  2
)};\n\nmodule.exports = campaignIds;`;

fs.writeFileSync("campaignIds.js", output);

console.log("✅ Saved campaignIds.js");
