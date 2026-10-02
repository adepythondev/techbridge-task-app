document.addEventListener("DOMContentLoaded", () => {
  const API_URL = API_BASE_URL + "/api/tasks";
  const USER_KEY = "techbridgeUser";
  const TIMEOUT_MS = 60000;
  const MAX_RETRIES = 2;

  const taskContainer = document.getElementById("dynamic-task-list");
  const loadingText = document.getElementById("loadingText");
  const errorText = document.getElementById("errorText");
  const noResultsText = document.getElementById("noResultsText");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".dash-filter");

  let allTasks = [];
  let currentFilter = "all";
  let currentQuery = "";

  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (user) {
      if (user.name) document.getElementById("intern-name").textContent = user.name;
      if (user.track) document.getElementById("intern-track").textContent = user.track + " Intern";
    }
  } catch (e) {}

  const escapeHtml = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const statusClass = (status) =>
    status ? status.toLowerCase().trim().replace(/\s+/g, "-") : "not-started";

  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Retry";
  retryBtn.className = "btn-primary";
  retryBtn.style.display = "none";
  retryBtn.style.marginTop = "10px";
  errorText.parentNode.appendChild(retryBtn);
  retryBtn.addEventListener("click", () => loadTasks());

  async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function loadTasks() {
    loadingText.style.display = "block";
    loadingText.textContent = "Loading tasks (server may take up to 60s to wake)...";
    errorText.style.display = "none";
    retryBtn.style.display = "none";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        allTasks = await fetchWithTimeout(API_URL);
        loadingText.style.display = "none";
        renderTasks();
        updateProgressStats(allTasks);
        return;
      } catch (err) {
        console.error("Fetch attempt " + (attempt + 1) + " failed:", err);
      }
    }
    loadingText.style.display = "none";
    errorText.style.display = "block";
    retryBtn.style.display = "inline-block";
  }

  function renderTasks() {
    taskContainer.innerHTML = "";
    const visible = allTasks.filter((t) => {
      const matchesFilter = currentFilter === "all" || statusClass(t.status) === currentFilter;
      const text = (t.title + " " + t.description + " " + t.status).toLowerCase();
      return matchesFilter && text.includes(currentQuery);
    });

    visible.forEach((task) => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.setAttribute("data-status", statusClass(task.status));
      card.innerHTML =
        '<h3 class="task-title">' + escapeHtml(task.title) + "</h3>" +
        '<p class="task-desc" style="margin-bottom:10px;">' + escapeHtml(task.description) + "</p>" +
        '<span style="padding:5px 10px;border-radius:5px;font-size:0.8rem;background:#333;color:#fff;">' +
        "Status: <strong>" + escapeHtml(task.status) + "</strong></span>";
      taskContainer.appendChild(card);
    });

    noResultsText.style.display = allTasks.length && visible.length === 0 ? "block" : "none";
  }

  function updateProgressStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter((t) => statusClass(t.status) === "completed").length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById("dash-total").textContent = total;
    document.getElementById("dash-completed").textContent = completed;
    document.getElementById("dash-remaining").textContent = total - completed;
    document.getElementById("dash-percentage").textContent = pct + "%";
    document.getElementById("dash-progress-fill").style.width = pct + "%";
  }

  searchInput.addEventListener("input", function () {
    currentQuery = this.value.toLowerCase().trim();
    renderTasks();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      currentFilter = e.currentTarget.getAttribute("data-filter");
      renderTasks();
    });
  });

  const techData = {
    nextjs: { title: "Next.js", text: "A React framework for production: server-side rendering, static generation, file-based routing and API routes." },
    vue: { title: "Vue.js", text: "A progressive JavaScript framework with reactive data binding and a gentle learning curve." },
    angular: { title: "Angular", text: "A TypeScript-based framework by Google for large, structured single-page applications." },
    backend: { title: "Backend Dev", text: "Server-side logic, databases and APIs using tools such as Flask, Node.js/Express, PostgreSQL and MongoDB." }
  };
  const panel = document.getElementById("tech-content-panel");
  const techTabs = document.querySelectorAll(".tech-tab");

  function showTech(key) {
    const d = techData[key];
    panel.innerHTML = "<h3>" + d.title + "</h3><p>" + d.text + "</p>";
  }
  techTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      techTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showTech(tab.getAttribute("data-tech"));
    });
  });
  showTech("nextjs");

  loadTasks();
});
