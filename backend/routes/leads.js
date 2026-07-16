const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getSummary,
  exportCsv,
} = require("../controllers/leadController");

// All lead routes require a valid login token
router.use(requireAuth);

// routes BEFORE "/:id" route
router.get("/summary/stats", getSummary);
router.get("/export/csv", exportCsv);

router.get("/", getLeads);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;
