// =========================
//  FOR DATE UTILITIES
// =========================

// For Converting a Date object into a string key like "2025-10-16"
// For using it as a unique key for logging daily habit completion
function toKey(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Function for returning key for the current date
function todayKey() {
  return toKey(new Date());
}

// For generating an array of the last 7 date keys, including today
function last7Keys() {
  const out = [];
  const base = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push(toKey(d));
  }
  return out;
}

// =========================
//  FOR STORAGING UTILITIES
// =========================

// LocalStorage key used for saving app data
const STORAGE_KEY = "habits_v4";

// For loading the saved state from localStorage, or returns a default empty state
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { habits: [] };
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.habits) ? parsed : { habits: [] };
  } catch {
    // This returns empty structure if parsing fails
    return { habits: [] };
  }
}

// This line saves the current app state to localStorage
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ============================
// FOR MODELLING THE FUNCTIONS
// ============================

// This line is for generating a unique ID for each habit (uses crypto if available)
function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// This function is for creating a new habit object with default fields
function newHabit(name) {
  return {
    id: uid(),
    name: String(name).trim(),
    createdOn: todayKey(),
    log: {}, // This line is for storing the completed dates log (true/false)
  };
}

// This is function is for calculating the current streak (consecutive days logged)
function computeStreak(habit, upTo = new Date()) {
  let streak = 0;
  let cur = new Date(upTo);
  while (true) {
    const key = toKey(cur);
    if (habit.log[key]) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ===================================================
//  FOR DOCUMENT OBJECT MODEL (DOM) REFERENCES
// ===================================================

// Cached DOM elements for performance and easy reuse
const rows = document.getElementById("rows");
const weekRange = document.getElementById("week-range");
const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-name");
const exportBtn = document.getElementById("export-json");
const importInput = document.getElementById("import-json");
const resetBtn = document.getElementById("reset-all");
const darkModeToggle = document.getElementById("dark-mode-toggle"); // For dark and ligh theme

// ===========================================================================
// THE INITIALIZATION  STATE FOR LOCALSTORAGE AND RENDERING THE HABIT
// ===========================================================================

// Load saved habits or initialize empty list
let state = loadState();

// Generate list of date keys for the previous week
const weekKeys = last7Keys();
weekRange.textContent = `${weekKeys[0]} to ${weekKeys[6]}`;

// =========================
//  FOR RENDERING FUNCTION
// =========================

// The Function to rebuild the habit tracker table based on current state
function render() {
  rows.innerHTML = "";

  if (!state.habits.length) {
    // Show empty placeholder row if no habits exist
    renderEmptyRow();
    return;
  }

  // This line render each habit row
  state.habits.forEach(renderHabitRow);
}

// Renders the "No habits yet" placeholder row
function renderEmptyRow() {
  const row = document.createElement("div");
  row.className = "habit-row";

  const nameCol = document.createElement("div");
  nameCol.className = "habit-name";
  nameCol.textContent = "No habits yet";
  row.appendChild(nameCol);

  // The empty cells for days of the week
  weekKeys.forEach(() => {
    const col = document.createElement("div");
    col.className = "habit-cell";
    row.appendChild(col);
  });

  // Placeholder streak and action columns
  const streakCol = document.createElement("div");
  streakCol.className = "streak-cell";
  streakCol.textContent = "0";
  row.appendChild(streakCol);

  const actionsCol = document.createElement("div");
  actionsCol.className = "habit-cell";
  actionsCol.textContent = "Add a habit";
  row.appendChild(actionsCol);

  rows.appendChild(row);
}

// This function is to render a single habit row with its 7-day buttons, streak, and actions
function renderHabitRow(habit) {
  const row = document.createElement("div");
  row.className = "habit-row";

  // Habit name column
  const nameCol = document.createElement("div");
  nameCol.className = "habit-name";
  nameCol.textContent = habit.name;
  row.appendChild(nameCol);

  // For making past date disable
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayKeyStr = toKey(today);
  const yesterdayKeyStr = toKey(yesterday);

  // For generating day buttons for the past week
  weekKeys.forEach((key) => {
    const col = document.createElement("div");
    col.className = "habit-cell";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-btn" + (habit.log[key] ? " checked" : "");
    btn.textContent = habit.log[key] ? "Yes" : "";
    btn.dataset.habitId = habit.id;
    btn.dataset.dateKey = key;

    // Apply special color classes
    if (key === todayKeyStr) {
      btn.classList.add("today-btn");
    } else if (key === yesterdayKeyStr) {
      btn.classList.add("yesterday-btn");
    }

    // Disable buttons for dates older than yesterday or future dates
    if (key < yesterdayKeyStr || key > todayKeyStr) {
      btn.disabled = true;
      btn.classList.add("disabled");
    } else {
      // Accessibility attributes
      btn.setAttribute("aria-label", `${habit.name} on ${key}`);
      btn.setAttribute("role", "checkbox");
      btn.setAttribute("aria-checked", String(!!habit.log[key]));

      // Click to toggle day
      btn.addEventListener("click", onToggleDay);

      // Support Enter/Space keys for toggling (keyboard accessibility)
      btn.addEventListener("keydown", (e) => {
        if (["Enter", " ", "Spacebar", "Space"].includes(e.key)) {
          e.preventDefault();
          btn.click();
        }
      });
    }

    col.appendChild(btn);
    row.appendChild(col);
  });

  // For streakong the column count
  const streakCol = document.createElement("div");
  streakCol.className = "streak-cell";
  streakCol.textContent = computeStreak(habit);
  row.appendChild(streakCol);

  // For creating div element for actions column (Tick Today / Delete)
  const actions = document.createElement("div");
  actions.className = "actions";

  const tickBtn = document.createElement("button");
  tickBtn.className = "action-btn";
  tickBtn.textContent = "Tick today";
  tickBtn.addEventListener("click", () => toggleLog(habit.id, todayKey()));

  const delBtn = document.createElement("button");
  delBtn.className = "action-btn delete";
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => {
    if (confirm(`Delete habit "${habit.name}"?`)) {
      state.habits = state.habits.filter((h) => h.id !== habit.id);
      saveState(state);
      render();
    }
  });

  actions.append(tickBtn, delBtn);
  row.appendChild(actions);

  rows.appendChild(row);
}

// =========================
//  ACTION HANDLERS
// =========================

// Handles clicking a day cell button
function onToggleDay(e) {
  const btn = e.currentTarget;
  toggleLog(btn.dataset.habitId, btn.dataset.dateKey);
}

// Function to toggle a specific day's "checked" state for a habit
function toggleLog(habitId, dateKey) {
  const habit = state.habits.find((h) => h.id === habitId);
  if (!habit) return;

  if (habit.log[dateKey]) delete habit.log[dateKey];
  else habit.log[dateKey] = true;

  saveState(state);
  render();
}

// =========================
//  FORM HANDLER
// =========================

// For handle form submission to create a new habit
habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;

  state.habits.push(newHabit(name));
  saveState(state);
  habitInput.value = "";
  render();
});

// =========================
//  EXPORT / IMPORT / RESET
// =========================

// Exports current state to a downloadable JSON file
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "habits-export.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Imports habits from a user-provided JSON file
importInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data.habits)) throw new Error("Invalid format");
    state = data;
    saveState(state);
    render();
    alert("Import complete");
  } catch {
    alert("Import failed. Please check the JSON file.");
  }

  // Reset file input for next upload
  e.target.value = "";
});

// Resets all data (clears localStorage)
resetBtn.addEventListener("click", () => {
  if (!confirm("Remove all habits and logs from this browser?")) return;
  state = { habits: [] };
  saveState(state);
  render();
});

// =========================
//  DARK MODE TOGGLE
// =========================

// Initializes dark mode toggle button with persistence
(function initDarkMode() {
  const pref = localStorage.getItem("darkMode") === "true";
  if (pref) document.body.classList.add("dark");

  darkModeToggle.textContent = pref ? "☀️" : "🌙";

  darkModeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
    darkModeToggle.textContent = isDark ? "☀️" : "🌙";
  });
})();

// =========================
//  INITIAL RENDER
// =========================

// Render the UI immediately after loading
render();
