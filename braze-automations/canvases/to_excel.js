const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Paths
const inputFile = path.join(__dirname, 'canvas_details.json'); // File where all fetched canvases data is stored
const outputExcel = path.join(__dirname, 'canvases_all.xlsx');
const jsonOutputDir = path.join(__dirname, 'canvas_json');

// Create folder for JSON files if not exists
if (!fs.existsSync(jsonOutputDir)) {
  fs.mkdirSync(jsonOutputDir);
}

// Read and parse data
const raw = fs.readFileSync(inputFile, 'utf8');
let data = JSON.parse(raw);

// Handle case if data is wrapped in an object like { canvases: [...] }
if (!Array.isArray(data) && data.canvases) {
  data = data.canvases;
}

// Process each canvas
const rows = data.map(c => {
  const clone = JSON.parse(JSON.stringify(c));

  // Remove heavy HTML bodies if they exist (optional)
  if (clone.steps) {
    clone.steps = clone.steps.map(step => {
      if (step.message && step.message.body) {
        delete step.message.body;
      }
      return step;
    });
  }

  // Convert to JSON string
  const jsonStr = JSON.stringify(clone, null, 2);

  let jsonFileRef = '';
  if (jsonStr.length > 32767) {
    // Save external file if too large for Excel
    const fileName = `${clone.id || clone.canvas_id || 'unknown'}.json`;
    fs.writeFileSync(path.join(jsonOutputDir, fileName), jsonStr, 'utf8');
    jsonFileRef = fileName;
  }

  return {
    id: clone.id || clone.canvas_id || '',
    name: clone.name || '',
    created_at: clone.created_at || '',
    updated_at: clone.updated_at || '',
    archived: clone.archived !== undefined ? clone.archived : '',
    enabled: clone.enabled !== undefined ? clone.enabled : '',
    draft: clone.draft !== undefined ? clone.draft : '',
    schedule_type: clone.schedule_type || '',
    channels: Array.isArray(clone.channels) ? clone.channels.join(', ') : '',
    tags: Array.isArray(clone.tags) ? clone.tags.join(', ') : '',
    steps_count: Array.isArray(clone.steps) ? clone.steps.length : '',
    full_data: jsonStr.length > 32767 ? '' : jsonStr, // Embed only if fits
    json_file: jsonFileRef // File reference for large ones
  };
});

// Write Excel
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(rows);
XLSX.utils.book_append_sheet(wb, ws, 'Canvases');
XLSX.writeFile(wb, outputExcel);

console.log(`Excel created: ${outputExcel}`);
console.log(`Large JSON files saved in: ${jsonOutputDir}`);
