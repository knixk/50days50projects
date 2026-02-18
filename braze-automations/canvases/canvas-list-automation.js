const axios = require("axios");
const fs = require("fs");

// --- CONFIG ---
const BRAZE_API_KEY = "7a8c3d45-312e-41e0-b8f7-8e986d3b7b18"; // Replace with your actual API key
const BRAZE_REST_ENDPOINT = "https://rest.fra-02.braze.eu";
const OUTPUT_FILE = "canvases2.json";
// ---------------

async function fetchCanvasPage(page = 0) {
  try {
    const response = await axios.get(`${BRAZE_REST_ENDPOINT}/canvas/list`, {
      headers: {
        Authorization: `Bearer ${BRAZE_API_KEY}`,
      },
      params: {
        page: page,
        include_archived: true,
        sort_direction: "desc",
        limit: 100, // Try max 100 per page if supported by your Braze instance
        // Remove or add filters if needed, e.g. 'last_edit.time[gt]'
      },
    });

    return response.data;
  } catch (err) {
    console.error(
      `Error fetching page ${page}:`,
      err.response?.data || err.message
    );
    return null;
  }
}

(async () => {
  let page = 0;
  let allCanvases = [];
  let hasMore = true;

  while (hasMore) {
    const data = await fetchCanvasPage(page);
    if (data && data.canvases && data.canvases.length > 0) {
      allCanvases = allCanvases.concat(data.canvases);
      console.log(`Fetched page ${page}, total so far: ${allCanvases.length}`);
      page++;
    } else {
      hasMore = false;
    }
  }

  console.log(`\nFetched ${allCanvases.length} canvases in total.`);

  // Write results to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCanvases, null, 2), "utf-8");
  console.log(`All canvases saved to ${OUTPUT_FILE}`);
})();
