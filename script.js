// script.js - frontend logic (runs in the browser)

// Grab the HTML elements we need to work with
const form = document.getElementById("selectForm");
const roleSelect = document.getElementById("role");
const departmentSelect = document.getElementById("department");
const message = document.getElementById("message");
const results = document.getElementById("results");
const taskList = document.getElementById("taskList");
const listTitle = document.getElementById("listTitle");

// ---------- FEATURE 1 + 2: select, validate, then ask the server for the checklist ----------
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading

  const role = roleSelect.value;
  const department = departmentSelect.value;

  // Validation: both dropdowns must be chosen
  if (role === "" || department === "") {
    message.textContent = "Please select both a role and a department.";
    results.hidden = true;
    return;
  }
  message.textContent = "";

  try {
    // Call the backend API (frontend <-> backend communication)
    const response = await fetch(
      `/api/checklist?role=${encodeURIComponent(role)}&department=${encodeURIComponent(department)}`
    );
    const data = await response.json(); // convert JSON text to a JS object

    if (!response.ok) {
      message.textContent = data.error;
      return;
    }

    showTasks(data);
  } catch (error) {
    message.textContent = "Could not reach the server. Is it running?";
  }
});

// ---------- FEATURE 3: display tasks ----------
function showTasks(data) {
  listTitle.textContent = `Tasks for ${data.role} in ${data.department}`;
  taskList.innerHTML = ""; // clear any old checklist

  data.tasks.forEach((taskName, index) => {
    const li = document.createElement("li");
    li.className = "task";

    // Each task = checkbox + name + status text
    li.innerHTML = `
      <input type="checkbox" id="task-${index}" />
      <label class="name" for="task-${index}"></label>
      <span class="status">Pending</span>
    `;
    // textContent (not innerHTML) is the safe way to insert text
    li.querySelector(".name").textContent = taskName;

    // When the checkbox changes (checked OR unchecked)
    li.querySelector("input").addEventListener("change", (e) => {
      li.classList.toggle("done", e.target.checked);
      li.querySelector(".status").textContent = e.target.checked ? "Completed" : "Pending";
      updateProgress(); // refresh dashboard immediately
    });

    taskList.appendChild(li);
  });

  results.hidden = false;
  updateProgress();
}

// ---------- FEATURE 4: progress dashboard ----------
function updateProgress() {
  const total = taskList.querySelectorAll("input").length;
  const done = taskList.querySelectorAll("input:checked").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("totalCount").textContent = total;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("remainingCount").textContent = total - done;
  document.getElementById("percent").textContent = percent + "%";
  document.getElementById("barFill").style.width = percent + "%";
}
