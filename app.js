const pageMeta = {
  home: { title: "Home", active: "home" },
  events: { title: "All events", active: "home", crumb: "Home" },
  event: { title: "Event details", active: "home", crumb: "Events" },
  chat: { title: "Develop an idea", active: "chat", crumb: "Home" },
  direct: { title: "Start directly", active: "direct", crumb: "Home" },
  direction: { title: "Content direction", active: "home", crumb: "Create" },
  output: { title: "Choose output", active: "home", crumb: "Create" },
  xdelivery: { title: "X Post delivery", active: "history", crumb: "Project" },
  videodelivery: { title: "Video package", active: "history", crumb: "Project" },
  history: { title: "Creation History", active: "history" },
  project: { title: "Project workspace", active: "history", crumb: "History" },
  channels: { title: "Channels", active: "channels" },
  settings: { title: "Settings", active: "settings" }
};

const navItems = [
  ["home", "index.html", "⌂", "Home"],
  ["history", "history.html", "◫", "Creation History"],
  ["channels", "channels.html", "◎", "Channels"],
  ["settings", "settings.html", "⌘", "Settings"]
];

function brandMarkup(link = "index.html") {
  return `<a class="brand" href="${link}" aria-label="CreatorPilot home"><span class="brand-mark"></span><span>CreatorPilot</span></a>`;
}

function mountShell() {
  const shell = document.querySelector("[data-page]");
  if (!shell || shell.dataset.auth === "true") return;
  const meta = pageMeta[shell.dataset.page] || pageMeta.home;
  const sidebar = document.getElementById("sidebar");
  const topbar = document.getElementById("topbar");

  if (sidebar) {
    sidebar.className = "sidebar";
    sidebar.innerHTML = `
      ${brandMarkup()}
      <button class="workspace-switcher" data-toast="Channel switcher opened">
        <span class="workspace-dot"></span>
        <span class="workspace-copy"><strong>AI & Technology</strong><span>12 new · updated 8 min ago</span></span>
        <span class="faint">⌄</span>
      </button>
      <div class="nav-label">Workspace</div>
      <nav class="nav-list" aria-label="Primary">
        ${navItems.map(([key, href, icon, label]) => `<a class="nav-item ${meta.active === key ? "active" : ""}" href="${href}"><span class="nav-icon">${icon}</span>${label}</a>`).join("")}
      </nav>
      <div class="nav-label">Create</div>
      <nav class="nav-list" aria-label="Create">
        <a class="nav-item pinned-create ${meta.active === "direct" ? "active" : ""}" href="direct-create.html"><span class="nav-icon">＋</span>Start directly</a>
      </nav>
      <div class="nav-label nav-label-row"><span>Recent chats</span><a href="history.html">View all</a></div>
      <nav class="session-list" aria-label="Recent chats">
        <a class="session-item ${meta.active === "chat" ? "active" : ""}" href="chat.html">
          <span class="session-icon">✦</span>
          <span class="session-copy"><strong>Why AI agents are moving into browsers?</strong><small>2m ago</small></span>
        </a>
        <a class="session-item" href="chat.html">
          <span class="session-icon">#</span>
          <span class="session-copy"><strong>Does AI search change how creators cite?</strong><small>4h ago</small></span>
        </a>
        <a class="session-item" href="chat.html">
          <span class="session-icon">#</span>
          <span class="session-copy"><strong>A simple guide to local language models</strong><small>Aug 9</small></span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="usage-mini">
          <div class="row"><strong>Monthly credits</strong><span>680 / 1,000</span></div>
          <div class="meter"><i></i></div>
          <span>Renews in 12 days</span>
        </div>
      </div>`;
  }

  if (topbar) {
    topbar.className = "topbar";
    topbar.innerHTML = `
      <div class="page-context">${meta.crumb ? `<span class="crumb">${meta.crumb}</span><span class="crumb">/</span>` : ""}<h1>${meta.title}</h1></div>
      <div class="top-actions">
        <span class="credits-pill"><i class="credits-gem"></i><strong>680</strong>&nbsp;credits</span>
        <button class="language-toggle" data-toast="Interface language: English">EN</button>
        <button class="top-icon" id="notificationButton" aria-label="Notifications">♢<i class="ping"></i></button>
        <button class="avatar" data-toast="Profile menu opened">LC</button>
      </div>`;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <aside class="notification-panel" id="notificationPanel" aria-label="Notifications">
      <div class="notification-head"><strong>Notifications</strong><button class="btn btn-sm btn-soft" data-toast="All marked as read">Mark all read</button></div>
      <div class="notification-item"><i class="dot"></i><div><strong>Your 45-second script is ready</strong><span>Review the script before captions and shots are generated · 2m</span></div></div>
      <div class="notification-item"><i class="dot" style="background:var(--sky)"></i><div><strong>Event updated</strong><span>OpenAI expands ChatGPT agent capabilities · 18m</span></div></div>
      <div class="notification-item"><i class="dot" style="background:var(--amber)"></i><div><strong>One source needs attention</strong><span>A paywalled link returned a partial summary · 1h</span></div></div>
    </aside>`);
}

function mountInteractions() {
  const notificationButton = document.getElementById("notificationButton");
  const notificationPanel = document.getElementById("notificationPanel");
  notificationButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationPanel?.classList.toggle("open");
  });
  document.addEventListener("click", (event) => {
    if (notificationPanel && !notificationPanel.contains(event.target) && event.target !== notificationButton) notificationPanel.classList.remove("open");
  });

  document.querySelectorAll("[data-toast]").forEach((element) => {
    element.addEventListener("click", () => showToast(element.dataset.toast));
  });

  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => toggle.classList.toggle("on"));
  });

  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    group.querySelectorAll(".choice-card").forEach((card) => {
      card.addEventListener("click", () => {
        group.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("selected"));
        card.classList.add("selected");
        const input = card.querySelector("input");
        if (input) input.checked = true;
      });
    });
  });

  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const scope = tabs.closest("[data-tab-scope]") || document;
    tabs.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        tabs.querySelectorAll("[data-tab]").forEach((item) => item.classList.remove("active"));
        scope.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.remove("active"));
        button.classList.add("active");
        scope.querySelector(`[data-panel="${button.dataset.tab}"]`)?.classList.add("active");
      });
    });
  });

  document.querySelectorAll("[data-fill-prompt]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const composer = document.querySelector(".composer-input");
      if (composer) composer.value = chip.textContent.trim();
    });
  });

  document.querySelectorAll(".check").forEach((check) => {
    check.closest(".info-row")?.addEventListener("click", () => check.classList.toggle("checked"));
  });
}

let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="toast-dot"></i><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector("span").textContent = message || "Done";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  mountShell();
  mountInteractions();
});
