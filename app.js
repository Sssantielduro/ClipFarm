const phases = {
  upload: document.getElementById("uploadPhase"),
  confirmation: document.getElementById("confirmationPhase"),
  loading: document.getElementById("loadingPhase"),
  viewing: document.getElementById("viewingPhase"),
};

const pages = {
  main: document.getElementById("mainPage"),
  projects: document.getElementById("projectsPage"),
  profile: document.getElementById("profilePage"),
};

const projectsSidebar = document.getElementById("projectsSidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const logo = document.getElementById("logo");
const profileButton = document.getElementById("profileButton");
const projectsList = document.getElementById("projectsList");
const projectBank = document.getElementById("projectBank");
const fileInput = document.getElementById("fileInput");
const previewVideo = document.getElementById("previewVideo");
const confirmVideoBtn = document.getElementById("confirmVideo");
const resetVideoBtn = document.getElementById("resetVideo");
const processingStatus = document.getElementById("processingStatus");
const clipsGrid = document.getElementById("clipsGrid");
const saveProjectBtn = document.getElementById("saveProject");
const exportClipsBtn = document.getElementById("exportClips");
const newProjectBtn = document.getElementById("newProject");

let selectedVideoUrl = null;
let processing = false;
let generatedClips = [];
let projects = [];

function setActivePage(name) {
  Object.values(pages).forEach((page) => page.classList.remove("active"));
  pages[name].classList.add("active");
}

function toggleSidebar() {
  const isHidden = projectsSidebar.classList.contains("hidden");
  projectsSidebar.classList.toggle("hidden", !isHidden);
  projectsSidebar.classList.toggle("show-mobile", isHidden);
}

toggleSidebarBtn.addEventListener("click", toggleSidebar);
logo.addEventListener("click", () => {
  setActivePage("main");
});
profileButton.addEventListener("click", () => setActivePage("profile"));

function renderProjects() {
  projectsList.innerHTML = "";
  projectBank.innerHTML = "";

  if (!projects.length) {
    const empty = document.createElement("div");
    empty.className = "project-card";
    empty.textContent = "No projects yet. Process clips to fill this space.";
    projectsList.appendChild(empty.cloneNode(true));
    projectBank.appendChild(empty);
    return;
  }

  projects.forEach((project, index) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="clip-meta">
        <strong>${project.title}</strong>
        <span class="clip-score">${project.score}</span>
      </div>
      <p>${project.description}</p>
      <div class="clip-actions">
        <button class="ghost-button" data-index="${index}" data-action="view">View</button>
        <button class="pill-button" data-index="${index}" data-action="load">Load</button>
      </div>
    `;
    projectsList.appendChild(card.cloneNode(true));
    projectBank.appendChild(card);
  });
}

function resetState() {
  selectedVideoUrl = null;
  processing = false;
  generatedClips = [];
  previewVideo.src = "";
  previewVideo.hidden = true;
  confirmVideoBtn.disabled = true;
  resetVideoBtn.disabled = true;
  processingStatus.textContent = "Waiting for confirmation...";
  saveProjectBtn.disabled = true;
  exportClipsBtn.disabled = true;
  clipsGrid.innerHTML = "";
}

function simulateClipGeneration() {
  processing = true;
  processingStatus.textContent = "Calibrating AI models...";

  const steps = [
    "Detecting highlights and key frames",
    "Scoring clips for virality",
    "Adding captions, zooms, and overlays",
    "Prepping exports for TikTok / Reels / Shorts",
  ];

  steps.forEach((text, idx) => {
    setTimeout(() => {
      processingStatus.textContent = text;
    }, (idx + 1) * 1000);
  });

  setTimeout(() => {
    processing = false;
    processingStatus.textContent = "Clips ready for review.";
    generatedClips = generateMockClips();
    renderClips();
    saveProjectBtn.disabled = false;
    exportClipsBtn.disabled = false;
  }, (steps.length + 1) * 1000);
}

function generateMockClips() {
  const topics = ["Punchline", "Plot Twist", "Reaction", "Advice", "Behind the Scenes"];
  return Array.from({ length: 6 }, (_, idx) => ({
    title: `${topics[idx % topics.length]} ${idx + 1}`,
    duration: `${15 + idx * 3}s`,
    score: Math.floor(Math.random() * 30) + 70,
    tags: ["TikTok", "Reels", idx % 2 === 0 ? "YouTube Shorts" : "Stories"],
  }));
}

function renderClips() {
  clipsGrid.innerHTML = "";
  generatedClips.forEach((clip) => {
    const card = document.createElement("div");
    card.className = "clip-card";
    card.innerHTML = `
      <div class="clip-meta">
        <strong>${clip.title}</strong>
        <span class="clip-score">${clip.score}</span>
      </div>
      <div class="clip-meta">
        <span>${clip.duration}</span>
        <span>${clip.tags.join(" · ")}</span>
      </div>
      <div class="clip-actions">
        <button class="pill-button">Edit</button>
        <button class="ghost-button">Publish</button>
      </div>
    `;
    clipsGrid.appendChild(card);
  });
}

fileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (selectedVideoUrl) URL.revokeObjectURL(selectedVideoUrl);
  selectedVideoUrl = URL.createObjectURL(file);
  previewVideo.src = selectedVideoUrl;
  previewVideo.hidden = false;
  confirmVideoBtn.disabled = false;
  resetVideoBtn.disabled = false;
  processingStatus.textContent = "Ready to process.";
});

confirmVideoBtn.addEventListener("click", () => {
  if (!selectedVideoUrl || processing) return;
  processingStatus.textContent = "Launching render pipeline...";
  simulateClipGeneration();
});

resetVideoBtn.addEventListener("click", () => {
  resetState();
  fileInput.value = "";
});

saveProjectBtn.addEventListener("click", () => {
  if (!generatedClips.length) return;
  const title = `Project ${projects.length + 1}`;
  const project = {
    title,
    score: `${Math.max(...generatedClips.map((c) => c.score))}/100`,
    description: "Bundle of AI-picked shorts ready for distribution.",
    clips: generatedClips,
  };
  projects.unshift(project);
  renderProjects();
  saveProjectBtn.disabled = true;
});

exportClipsBtn.addEventListener("click", () => {
  if (!generatedClips.length) return;
  processingStatus.textContent = "Packaging exports in 9:16 and 1:1...";
  setTimeout(() => {
    processingStatus.textContent = "Exports queued for delivery.";
  }, 800);
});

projectsSidebar.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  const project = projects[index];
  if (!project) return;

  if (action === "view") {
    setActivePage("projects");
  }

  if (action === "load") {
    generatedClips = project.clips;
    renderClips();
    setActivePage("main");
    processingStatus.textContent = "Loaded project from bank.";
    saveProjectBtn.disabled = false;
    exportClipsBtn.disabled = false;
  }
});

newProjectBtn.addEventListener("click", () => {
  resetState();
  setActivePage("main");
});

renderProjects();
resetState();
