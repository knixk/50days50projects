import fs from "fs";
import * as XLSX from "xlsx";

// load JSON
const data = JSON.parse(fs.readFileSync("tags2.json", "utf8"));

// transform to rows
const rows = data.results.map(item => ({
  "Tag Name": item.name,
  "Campaigns": item.campaigns_count,
  "Workflows": item.workflows_count,
  "Segments": item.segments_count,
  "Cards": item.cards_count,
  "Templates": item.templates_count,
  "Locations": item.locations_count,
  "Engagement Reports": item.engagement_reports_count,
  "Total Usage":
    item.campaigns_count +
    item.workflows_count +
    item.segments_count +
    item.cards_count +
    item.templates_count +
    item.locations_count +
    item.engagement_reports_count,
  "Notes": ""
}));

// create workbook
const ws = XLSX.utils.json_to_sheet(rows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Tags");

// save Excel
XLSX.writeFile(wb, "braze_tags.xlsx");

console.log("✅ braze_tags.xlsx created!");
