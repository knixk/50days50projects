const fs = require("fs");
const XLSX = require("xlsx");

// Load your JSON file
const raw = fs.readFileSync("centers.json", "utf8");
const data = JSON.parse(raw);

// Map the fields you want

const rows = data.preference_centers.map((pc) => ({
  Name: pc.name,
  API_ID: pc.preference_center_api_id,
  Created_At: pc.created_at,
  Updated_At: pc.updated_at,
  State: pc.state,
}));

// Convert JSON to worksheet
const worksheet = XLSX.utils.json_to_sheet(rows);

// Create workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "PreferenceCenters");

// Write to Excel
XLSX.writeFile(workbook, "preference_centers.xlsx");

console.log("✅ preference_centers.xlsx created!");
