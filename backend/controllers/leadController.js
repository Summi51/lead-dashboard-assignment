const { v4: uuidv4 } = require("uuid");
const { readLeads, writeLeads } = require("../models/leadModel");

const ALLOWED_STATUSES = ["New", "Contacted", "Site Visit Scheduled", "Closed", "Lost"];

function validateLead(body, isUpdate = false) {
  const errors = [];
  if (!isUpdate || body.name !== undefined) {
    if (!body.name || !body.name.trim()) errors.push("Name is required.");
  }
  if (!isUpdate || body.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) errors.push("A valid email is required.");
  }
  if (!isUpdate || body.phone !== undefined) {
    if (!body.phone || !body.phone.trim()) errors.push("Phone number is required.");
  }
  if (!isUpdate || body.unitType !== undefined) {
    if (!body.unitType || !body.unitType.trim()) errors.push("Unit type is required.");
  }
  if (!isUpdate || body.budget !== undefined) {
    if (!body.budget || !body.budget.toString().trim()) errors.push("Budget is required.");
  }
  if (!isUpdate || body.status !== undefined) {
    if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
      errors.push("A valid status is required.");
    }
  }
  return errors;
}

// GET /api/leads?search=&status=&unitType=&sort=asc|desc
function getLeads(req, res) {
  let leads = readLeads();
  const { search, status, unitType, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(
      (l) => l.name.toLowerCase().includes(q) || l.phone.includes(q)
    );
  }
  if (status) {
    leads = leads.filter((l) => l.status === status);
  }
  if (unitType) {
    leads = leads.filter((l) => l.unitType === unitType);
  }
  if (sort === "asc") {
    leads.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
  } else if (sort === "desc") {
    leads.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  }

  res.json(leads);
}

function getLeadById(req, res) {
  const leads = readLeads();
  const lead = leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found." });
  res.json(lead);
}


// POST /api/leads
function createLead(req, res) {
  const errors = validateLead(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const leads = readLeads();
  const newLead = {
    id: uuidv4(),
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    phone: req.body.phone.trim(),
    property: req.body.property ? req.body.property.trim() : "",
    unitType: req.body.unitType,
    budget: req.body.budget,
    source: req.body.source || "Website",
    status: req.body.status,
    notes: req.body.notes || "",
    followUpDate: req.body.followUpDate || "",
    createdDate: new Date().toISOString(),
  };

  leads.unshift(newLead);
  writeLeads(leads);
  res.status(201).json(newLead);
}

// PUT /api/leads/:id
function updateLead(req, res) {
  const errors = validateLead(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  const leads = readLeads();
  const index = leads.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Lead not found." });

  leads[index] = { ...leads[index], ...req.body, id: leads[index].id };
  writeLeads(leads);
  res.json(leads[index]);
}

// DELETE /api/leads/:id
function deleteLead(req, res) {
  const leads = readLeads();
  const index = leads.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Lead not found." });

  const [removed] = leads.splice(index, 1);
  writeLeads(leads);
  res.json({ message: "Lead deleted.", lead: removed });
}

// GET /api/leads/summary/stats
function getSummary(req, res) {
  const leads = readLeads();
  const summary = {
    total: leads.length,
    New: 0,
    Contacted: 0,
    "Site Visit Scheduled": 0,
    Closed: 0,
    Lost: 0,
  };
  leads.forEach((l) => {
    if (summary[l.status] !== undefined) summary[l.status] += 1;
  });
  res.json(summary);
}

// GET /api/leads/export/csv
function exportCsv(req, res) {
  const leads = readLeads();
  const headers = [
    "Name", "Email", "Phone", "Property", "Unit Type",
    "Budget", "Source", "Status", "Notes", "Follow Up Date", "Created Date",
  ];
  const rows = leads.map((l) =>
    [l.name, l.email, l.phone, l.property, l.unitType, l.budget, l.source, l.status, l.notes, l.followUpDate, l.createdDate]
      .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.send(csv);
}

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getSummary,
  exportCsv,
  ALLOWED_STATUSES,
};
