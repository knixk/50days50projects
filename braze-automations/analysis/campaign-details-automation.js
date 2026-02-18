// fetchCampaigns.js
const fs = require("fs");
const axios = require("axios");

const API_KEY = `7a8c3d45-312e-41e0-b8f7-8e986d3b7b18`; // Replace with your real Braze API key
const BASE_URL = "https://rest.fra-02.braze.eu/campaigns/details";

// TODO: Paste your campaign IDs here
const campaignIds = [
  "71d84b7f-3166-4822-a347-95ae7a61d647",
  "395603ef-bcbe-4162-b50d-f6c5e4d22163",
  "7023362c-f4c0-4ece-9341-23cd238268f3",
  "56439627-dd4d-4560-80ff-a90799aa0b64",
  "2645be4a-3fe8-4387-8d8e-db5d1f2f1695",
  "c54060e3-6474-45be-8255-d1e2070352ef",
  "78ebdc75-2c8c-4797-854a-b9fef5927d7a",
  "c2ff83e9-39aa-457d-b7ea-a4a3a2cc17b6",
  "17149a05-e0f2-499f-b836-a33b5b2dfe72",
  "af385103-03af-4b86-a2ab-69ea676cc304",
  "85462bd0-cd73-4f11-990f-1b2bb412a83c",
];

(async () => {
  const results = [];

  for (const id of campaignIds) {
    try {
      const res = await axios.get(`${BASE_URL}?campaign_id=${id}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      results.push(res.data);
      console.log(`✅ Got details for ${id}`);
    } catch (err) {
      console.error(`❌ Failed for ${id}`, err.response?.data || err.message);
    }
  }

  fs.writeFileSync("campaignsDetails10.json", JSON.stringify(results, null, 2));
  console.log(`🎉 Done! Saved ${results.length} campaigns to campaigns.json`);
})();
