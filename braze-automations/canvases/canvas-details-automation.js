const axios = require("axios");
const fs = require("fs");

// --- CONFIG ---
const BRAZE_API_KEY = `7a8c3d45-312e-41e0-b8f7-8e986d3b7b18`; // Replace with your API key
const BRAZE_REST_ENDPOINT = "https://rest.fra-02.braze.eu";
const INPUT_FILE = "canvases2.json"; // File from previous step
const OUTPUT_FILE = "canvas_details.json";
const REQUESTS_PER_SECOND = 3;
// -------------

async function fetchCanvasDetails(canvasId) {
  try {
    const response = await axios.get(`${BRAZE_REST_ENDPOINT}/canvas/details`, {
      headers: {
        Authorization: `Bearer ${BRAZE_API_KEY}`,
      },
      params: {
        canvas_id: canvasId,
      },
    });
    return response.data;
  } catch (err) {
    console.error(
      `Error fetching canvas ${canvasId}:`,
      err.response?.data || err.message
    );
    return null;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  // Load list of canvases
  const canvases = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));
  const canvasIds = canvases.map((c) => c.id);

  // Load any existing saved data (fault tolerance)
  let savedData = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    savedData = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
  }
  const alreadyFetchedIds = new Set(savedData.map((c) => c.id));

  const pendingIds = canvasIds.filter((id) => !alreadyFetchedIds.has(id));

  console.log(`Total canvases: ${canvasIds.length}`);
  console.log(`Already fetched: ${alreadyFetchedIds.size}`);
  console.log(`Pending: ${pendingIds.length}`);

  for (let i = 0; i < pendingIds.length; i++) {
    const id = pendingIds[i];
    const details = await fetchCanvasDetails(id);
    if (details) {
      // Add a marker for which canvas ID this belongs to
      details.id = id;
      savedData.push(details);

      // Save progress after every request (fault tolerance)
      fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(savedData, null, 2),
        "utf-8"
      );
      console.log(`Fetched ${i + 1}/${pendingIds.length}: ${id}`);
    }

    // Rate limiting: max 3 reqs per sec => wait ~333ms between calls
    await sleep(1000 / REQUESTS_PER_SECOND);
  }

  console.log(`\nDone! Fetched ${savedData.length} canvas details.`);
})();
