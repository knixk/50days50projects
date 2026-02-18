const fs = require("fs");
const XLSX = require("xlsx");

function flattenSegment(seg) {
  return {
    id: seg.id,
    app_group_id: seg.app_group_id,
    name: seg.name,
    marked_as_deleted: seg.marked_as_deleted,
    starred_by_current_developer: seg.starred_by_current_developer,
    enable_analytics_tracking: seg.enable_analytics_tracking,
    description: seg.description || "",
    tag_ids: seg.tags ? seg.tags.map(t => t.id).join(", ") : "",
    tag_names: seg.tags ? seg.tags.map(t => t.name).join(", ") : "",
    last_edited: seg.last_edited,
    last_edited_by_id: seg.last_edited_by?.developer_id || "",
    last_edited_by_name: seg.last_edited_by?.developer_name || "",
  };
}

function convertJSONtoExcel() {
  const raw = fs.readFileSync("segments.json", "utf8");
  const data = JSON.parse(raw);

  const rows = data.map(flattenSegment);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Segments");

  XLSX.writeFile(workbook, "segments2.xlsx");
  console.log(`✅ Exported ${rows.length} segments to segments.xlsx`);
}

convertJSONtoExcel();
