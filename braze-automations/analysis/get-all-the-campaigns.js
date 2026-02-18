// save as fetchCampaigns.js
const fs = require("fs");
const axios = require("axios");

const API_URL = "https://rest.fra-02.braze.eu/campaigns/list";
const AUTH_TOKEN = "7a8c3d45-312e-41e0-b8f7-8e986d3b7b18"; // replace with env var in prod

// Braze returns max 100 campaigns per page
const PAGE_SIZE = 100;
const TOTAL_CAMPAIGNS = 3544; // adjust if needed
const TOTAL_PAGES = Math.ceil(TOTAL_CAMPAIGNS / PAGE_SIZE);

async function fetchCampaigns() {
  let allCampaigns = [];

  for (let page = 0; page < TOTAL_PAGES; page++) {
    try {
      console.log(`Fetching page ${page + 1} of ${TOTAL_PAGES}...`);

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        params: {
          page: page,
          include_archived: true,
          sort_direction: "desc",
          "last_edit.time[gt]": "2020-06-28T23:59:59-05:00",
        },
      });

      if (response.data.campaigns) {
        allCampaigns = allCampaigns.concat(response.data.campaigns);
      }

      // polite delay (adjust if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
    }
  }

  console.log(`Fetched ${allCampaigns.length} campaigns total`);

  // Write to file
  fs.writeFileSync(
    "all-the-campaigns.json",
    JSON.stringify(allCampaigns, null, 2)
  );
  console.log("Saved to campaigns.json");
}

fetchCampaigns();
