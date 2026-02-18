// fetch_tags.js
import axios from "axios";
import fs from "fs";

const OUTPUT_FILE = "tags.json";

// Replace with your actual headers from the curl
const headers = {
  "accept": "application/json",
  "content-type": "application/json",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "x-csrf-token": "-sbMAS7iHY3Yw3kkVamOXdDAQUP8iKqg0OA6l9fegAnU7vUGoZ2zX6wVM2a_PylBP9vc3ocGba69IMNdiAGa0w",
  "x-requested-with": "XMLHttpRequest",
  "cookie": `i18next=en; ab.storage.userId.bef30adf-6179-4b26-a3b5-42268996ad95=g%3A689121c9092d971bc637fbf9%7Ce%3Aundefined%7Cc%3A1754383763972%7Cl%3A1754383763973; ...your full cookie here...`
};

// Base URL for the tags
const baseUrl = "https://dashboard-02.braze.eu/app_settings/tags_data";

async function fetchAllTags() {
  let start = 0;
  const limit = 50; // increase batch size for fewer requests
  let allTags = [];
  let hasMore = true;

  while (hasMore) {
    const url = `${baseUrl}?query[0][key]=&query[0][value]=&limit=${limit}&start=${start}&sortby=name&sortdir=1&app_group_id=63d20ec21ca79800489b5c27`;

    try {
      const res = await axios.get(url, { headers });
      const data = res.data;

      if (data && data.tags && data.tags.length > 0) {
        allTags = allTags.concat(data.tags);
        console.log(`Fetched ${data.tags.length} tags (total: ${allTags.length})`);
        start += limit;
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error("Error fetching tags:", err.response?.status, err.response?.data || err.message);
      break;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTags, null, 2));
  console.log(`✅ Saved ${allTags.length} tags into ${OUTPUT_FILE}`);
}

fetchAllTags();
