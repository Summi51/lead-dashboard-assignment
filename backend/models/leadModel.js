const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "leads.json");

function readLeads() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw || "[]");
}

function writeLeads(leads) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

module.exports = { readLeads, writeLeads };
