// json_to_excel.js
import fs from "fs";
import XLSX from "xlsx";

const INPUT_FILE = "final_campaign_details.json"; // your 3500 campaigns file
const OUTPUT_EXCEL = "final_campaigns.xlsx";
const OUTPUT_JSON = "all_campaign_details_full.json";

// Load full JSON
const campaigns = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));

// Save full data separately for engineers
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(campaigns, null, 2));
console.log(`✅ Full raw data saved to ${OUTPUT_JSON}`);

const rows = campaigns.map((c) => {
  const d = c.data || {};
  const msg = d.messages ? JSON.stringify(d.messages) : null;

  // Excel-safe truncation
  const MAX_LEN = 1000; // you can increase/decrease this
  const truncatedMsg =
    msg && msg.length > MAX_LEN ? msg.slice(0, MAX_LEN) + "...[truncated]" : msg;

  return {
    id: c.id,
    created_at: d.created_at,
    updated_at: d.updated_at,
    name: d.name,
    description: d.description,
    archived: d.archived,
    enabled: d.enabled,
    draft: d.draft,
    schedule_type: d.schedule_type,
    channels: d.channels ? d.channels.join(", ") : "",
    tags: d.tags ? d.tags.join(", ") : "",
    first_sent: d.first_sent,
    last_sent: d.last_sent,
    messages: truncatedMsg,
    messages_truncated: msg && msg.length > MAX_LEN ? true : false,
    messages_full_reference: true, // always true since full JSON file exists
  };
});

// Convert to worksheet
const ws = XLSX.utils.json_to_sheet(rows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Campaigns");

// Write Excel
XLSX.writeFile(wb, OUTPUT_EXCEL);
console.log(`✅ Excel file written: ${OUTPUT_EXCEL}`);
