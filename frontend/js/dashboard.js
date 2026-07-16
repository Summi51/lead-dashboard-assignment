// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  // ---- Route  ----
  if (!Auth.isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  const user = Auth.getUser();
  document.getElementById("sidebarUser").textContent = user ? `Signed in as ${user.email}` : "";

  const tbody = document.getElementById("leadsTableBody");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const unitFilter = document.getElementById("unitFilter");
  const sortOrder = document.getElementById("sortOrder");

  const leadModalBackdrop = document.getElementById("leadModalBackdrop");
  const leadModalTitle = document.getElementById("leadModalTitle");
  const leadForm = document.getElementById("leadForm");
  const formAlert = document.getElementById("formAlert");
  

  const viewModalBackdrop = document.getElementById("viewModalBackdrop");
  const detailGrid = document.getElementById("detailGrid");


  const confirmModalBackdrop = document.getElementById("confirmModalBackdrop");
  let pendingDeleteId = null;

  const STATUS_CLASS = {
    "New": "badge-New",
    "Contacted": "badge-Contacted",
    "Site Visit Scheduled": "badge-SiteVisitScheduled",
    "Closed": "badge-Closed",
    "Lost": "badge-Lost",
  };

  // ---- Toasts ----
  function toast(message, type = "success") {
    const wrap = document.getElementById("toastWrap");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ---- Summary ----
  async function loadSummary() {
    try {
      const s = await Api.getSummary();
      document.getElementById("statTotal").textContent = s.total;
      document.getElementById("statNew").textContent = s.New;
      document.getElementById("statContacted").textContent = s.Contacted;
      document.getElementById("statVisit").textContent = s["Site Visit Scheduled"];
      document.getElementById("statClosed").textContent = s.Closed;
      document.getElementById("statLost").textContent = s.Lost;
    } catch (err) {
      toast(err.message, "error");
    }
  }

  // ---- Table rendering ----
  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  function buildQuery() {
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
    if (statusFilter.value) params.set("status", statusFilter.value);
    if (unitFilter.value) params.set("unitType", unitFilter.value);
    params.set("sort", sortOrder.value);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  let currentLeads = [];

  async function loadLeads() {
    try {
      currentLeads = await Api.getLeads(buildQuery());
      renderTable(currentLeads);
    } catch (err) {
      toast(err.message, "error");
    }
  }

  function renderTable(leads) {
    tbody.innerHTML = "";
    if (!leads.length) {
      emptyState.classList.remove("hidden");
      return;
    }
    emptyState.classList.add("hidden");

    leads.forEach((lead) => {
      const tr = document.createElement("tr");
      const badgeClass = STATUS_CLASS[lead.status] || "badge-New";
      tr.innerHTML = `
        <td>
          <div class="cell-name">${escapeHtml(lead.name)}</div>
          <div class="cell-sub">${escapeHtml(lead.source || "")}</div>
        </td>
        <td>
          <div>${escapeHtml(lead.phone)}</div>
          <div class="cell-sub">${escapeHtml(lead.email)}</div>
        </td>
        <td>${escapeHtml(lead.property || "—")}</td>
        <td>${escapeHtml(lead.unitType)}</td>
        <td>${escapeHtml(lead.budget)}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(lead.status)}</span></td>
        <td>${formatDate(lead.createdDate)}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" data-action="view" data-id="${lead.id}">View</button>
            <button class="icon-btn" data-action="edit" data-id="${lead.id}">Edit</button>
            <button class="icon-btn danger" data-action="delete" data-id="${lead.id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    return (str ?? "").toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const lead = currentLeads.find((l) => l.id === id);
    if (!lead) return;

    if (btn.dataset.action === "view") openViewModal(lead);
    if (btn.dataset.action === "edit") openLeadModal(lead);
    if (btn.dataset.action === "delete") openConfirmModal(id);
  });

  // ---- Filters ----
  [searchInput].forEach((el) => el.addEventListener("input", debounce(loadLeads, 300)));
  [statusFilter, unitFilter, sortOrder].forEach((el) => el.addEventListener("change", loadLeads));
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "";
    unitFilter.value = "";
    sortOrder.value = "desc";
    loadLeads();
  });

  function debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  // ---- Add / Edit modal ----
  const fieldMap = {
    fullName: { input: "fullName", error: "fullNameError" },
    leadEmail: { input: "leadEmail", error: "leadEmailError" },
    leadPhone: { input: "leadPhone", error: "leadPhoneError" },
    unitType: { input: "unitType", error: "unitTypeError" },
    budget: { input: "budget", error: "budgetError" },
    status: { input: "status", error: "statusError" },
  };

  function clearFormErrors() {
    formAlert.classList.add("hidden");
    Object.values(fieldMap).forEach(({ input, error }) => {
      document.getElementById(input).parentElement.classList.remove("has-error");
      const errEl = document.getElementById(error);
      errEl.textContent = "";
      errEl.classList.add("hidden");
    });
  }

  function openLeadModal(lead = null) {
    clearFormErrors();
    leadForm.reset();
    document.getElementById("leadId").value = lead ? lead.id : "";
    leadModalTitle.textContent = lead ? "Edit Lead" : "Add Lead";

    if (lead) {
      document.getElementById("fullName").value = lead.name;
      document.getElementById("leadEmail").value = lead.email;
      document.getElementById("leadPhone").value = lead.phone;
      document.getElementById("leadProperty").value = lead.property || "";
      document.getElementById("unitType").value = lead.unitType;
      document.getElementById("budget").value = lead.budget;
      document.getElementById("leadSource").value = lead.source || "Website";
      document.getElementById("status").value = lead.status;
      document.getElementById("followUpDate").value = lead.followUpDate || "";
      document.getElementById("notes").value = lead.notes || "";
    }
    leadModalBackdrop.classList.remove("hidden");
  }

  function closeLeadModal() {
    leadModalBackdrop.classList.add("hidden");
  }

  document.getElementById("addLeadBtn").addEventListener("click", () => openLeadModal());
  document.getElementById("leadModalClose").addEventListener("click", closeLeadModal);
  document.getElementById("leadCancelBtn").addEventListener("click", closeLeadModal);

  function validateForm() {
    const values = {
      name: document.getElementById("fullName").value.trim(),
      email: document.getElementById("leadEmail").value.trim(),
      phone: document.getElementById("leadPhone").value.trim(),
      unitType: document.getElementById("unitType").value,
      budget: document.getElementById("budget").value.trim(),
      status: document.getElementById("status").value,
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};
    if (!values.name) errors.fullName = "Name is required.";
    if (!values.email || !emailRegex.test(values.email)) errors.leadEmail = "A valid email is required.";
    if (!values.phone) errors.leadPhone = "Phone number is required.";
    if (!values.unitType) errors.unitType = "Unit type is required.";
    if (!values.budget) errors.budget = "Budget is required.";
    if (!values.status) errors.status = "Status is required.";

    Object.entries(errors).forEach(([key, message]) => {
      const map = fieldMap[key];
      document.getElementById(map.input).parentElement.classList.add("has-error");
      const errEl = document.getElementById(map.error);
      errEl.textContent = message;
      errEl.classList.remove("hidden");
    });

    return { valid: Object.keys(errors).length === 0, values };
  }

  document.getElementById("leadSaveBtn").addEventListener("click", async () => {
    clearFormErrors();
    const { valid, values } = validateForm();
    if (!valid) return;

    const payload = {
      ...values,
      property: document.getElementById("leadProperty").value.trim(),
      source: document.getElementById("leadSource").value,
      followUpDate: document.getElementById("followUpDate").value,
      notes: document.getElementById("notes").value.trim(),
    };

    const id = document.getElementById("leadId").value;
    const saveBtn = document.getElementById("leadSaveBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      if (id) {
        await Api.updateLead(id, payload);
        toast("Lead updated successfully.");
      } else {
        await Api.createLead(payload);
        toast("Lead added successfully.");
      }
      closeLeadModal();
      loadLeads();
      loadSummary();
    } catch (err) {
      formAlert.textContent = err.message;
      formAlert.classList.remove("hidden");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Lead";
    }
  });

  // ---- View modal ----
  function openViewModal(lead) {
    detailGrid.innerHTML = `
      ${detailItem("Lead Name", lead.name)}
      ${detailItem("Status", lead.status)}
      ${detailItem("Email", lead.email)}
      ${detailItem("Phone", lead.phone)}
      ${detailItem("Interested Property", lead.property || "—")}
      ${detailItem("Unit Type", lead.unitType)}
      ${detailItem("Budget", lead.budget)}
      ${detailItem("Lead Source", lead.source || "—")}
      ${detailItem("Follow-up Date", lead.followUpDate || "Not set")}
      ${detailItem("Created", formatDate(lead.createdDate))}
      ${detailItem("Notes", lead.notes || "—", true)}
    `;
    viewModalBackdrop.classList.remove("hidden");
  }
  function detailItem(label, value, full = false) {
    return `<div class="detail-item ${full ? "span-2" : ""}" style="${full ? "grid-column:1/-1" : ""}">
      <div class="label">${label}</div><div class="val">${escapeHtml(value)}</div>
    </div>`;
  }
  document.getElementById("viewModalClose").addEventListener("click", () => viewModalBackdrop.classList.add("hidden"));
  document.getElementById("viewCloseBtn").addEventListener("click", () => viewModalBackdrop.classList.add("hidden"));

  // ---- Delete confirm ----
  function openConfirmModal(id) {
    pendingDeleteId = id;
    confirmModalBackdrop.classList.remove("hidden");
  }
  function closeConfirmModal() {
    pendingDeleteId = null;
    confirmModalBackdrop.classList.add("hidden");
  }
  document.getElementById("confirmModalClose").addEventListener("click", closeConfirmModal);
  document.getElementById("confirmCancelBtn").addEventListener("click", closeConfirmModal);
  document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    if (!pendingDeleteId) return;
    try {
      await Api.deleteLead(pendingDeleteId);
      toast("Lead deleted.");
      closeConfirmModal();
      loadLeads();
      loadSummary();
    } catch (err) {
      toast(err.message, "error");
    }
  });

  // ---- CSV export ----
  document.getElementById("exportBtn").addEventListener("click", async () => {
    try {
      const blob = await Api.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast(err.message, "error");
    }
  });

  // ---- Logout ----
  document.getElementById("logoutBtn").addEventListener("click", () => {
    Auth.clear();
    window.location.href = "index.html";
  });

  // ---- Init ----
  loadSummary();
  loadLeads();
});
