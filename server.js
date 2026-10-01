// server.js - a small Express server that:
//   1. serves the frontend files (HTML/CSS/JS)
//   2. provides the API:  GET /api/checklist?role=...&department=...

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------- Checklist data (our "database" is just plain JavaScript objects) ----------

// Tasks that EVERY new employee gets
const commonTasks = [
  "Complete HR documentation",
  "Set up company email",
  "Attend company orientation session",
];

// Extra tasks that depend on the ROLE
const roleTasks = {
  Developer: [
    "Set up development environment",
    "Get access to GitHub/repository",
    "Meet the development team",
    "Read company/project guidelines",
  ],
  Designer: [
    "Install design tools",
    "Get access to design resources",
    "Meet the design team",
    "Read project guidelines",
  ],
  Tester: [
    "Set up testing tools and test environment",
    "Get access to the bug tracking system",
    "Meet the QA team",
    "Read the test plans and quality guidelines",
  ],
  HR: [
    "Get access to the HR management system",
    "Review employee policies and handbook",
    "Meet the HR team",
    "Learn the recruitment and onboarding process",
  ],
  Marketing: [
    "Get access to marketing and social media accounts",
    "Review the brand guidelines",
    "Meet the marketing team",
    "Read the current campaign plans",
  ],
};

// Extra tasks that depend on the DEPARTMENT
const departmentTasks = {
  IT: ["Complete IT security training", "Set up VPN and system access"],
  HR: ["Review HR compliance and confidentiality rules"],
  Finance: ["Set up payroll and bank details", "Learn the expense reimbursement process"],
  Marketing: ["Review the marketing calendar and goals"],
};

// ---------- API route ----------
app.get("/api/checklist", (req, res) => {
  const { role, department } = req.query; // values after the "?" in the URL

  // Validation: both values must be known
  if (!role || !department) {
    return res.status(400).json({ error: "Please provide both role and department." });
  }
  if (!roleTasks[role] || !departmentTasks[department]) {
    return res.status(400).json({ error: "Unknown role or department." });
  }

  // Combine the three lists. Set removes duplicates (e.g. same task in two lists).
  const tasks = [
    ...new Set([...commonTasks, ...roleTasks[role], ...departmentTasks[department]]),
  ];

  res.json({ role, department, tasks }); // send JSON back
});

// ---------- Serve the frontend folder ----------
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
