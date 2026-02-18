// campaign_details_fetcher.js
import fs from "fs";
import fetch from "node-fetch";

const API_KEY = `7a8c3d45-312e-41e0-b8f7-8e986d3b7b18`;
const BASE_URL = "https://rest.fra-02.braze.eu";
const INPUT_FILE = "all-the-campaigns.json"; // input campaigns list
const OUTPUT_FILE = "final_campaign_details.json"; // progressive results
const FAILED_FILE = "failed_campaigns.json"; // store permanently failed ones

// Load campaign IDs

const raw = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));

// If your JSON is wrapped with { campaigns: [...] }
const campaigns = raw.campaigns || raw;
// const campaigns = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8")).campaigns;
const ids = campaigns.map((c) => c.id);

console.log(`Total campaigns to fetch: ${ids.length}`);

// Load progress if exists
let results = [];
if (fs.existsSync(OUTPUT_FILE)) {
  results = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
}
const fetchedIds = new Set(results.map((r) => r.id));

// Load failed IDs if exists
let failed = [];
if (fs.existsSync(FAILED_FILE)) {
  failed = JSON.parse(fs.readFileSync(FAILED_FILE, "utf8"));
}

async function fetchCampaignDetails(id, retries = 3) {
  const url = `${BASE_URL}/campaigns/details?campaign_id=${id}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { id, data };
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying ${id} (${3 - retries + 1})...`);
      await new Promise((r) => setTimeout(r, 1000)); // wait 1s before retry
      return fetchCampaignDetails(id, retries - 1);
    } else {
      console.error(`❌ Failed for ${id}: ${err.message}`);
      failed.push({ id, error: err.message });
      fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2));
      return null; // don't block progress
    }
  }
}

async function main() {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (fetchedIds.has(id)) {
      continue; // skip already done
    }

    const details = await fetchCampaignDetails(id);

    if (details) {
      results.push(details);
      // Save progress after every success
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
      console.log(`✅ Fetched ${i + 1}/${ids.length} - ${id}`);
    }

    // Delay ~333ms = 3 requests/sec
    await new Promise((res) => setTimeout(res, 333));
  }

  console.log("🎉 Done! All campaign details attempted.");
  console.log(`✅ Success: ${results.length}`);
  console.log(`❌ Failed: ${failed.length} (see ${FAILED_FILE})`);
}

main();
