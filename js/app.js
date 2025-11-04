// =========================
//  FOR DATE UTILITIES
// =========================

// These functions generate date strings (like "2025-10-16")
// to uniquely represent each day for tracking purposes.
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
// Generate a list of date keys for the last 7 days
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
// These functions handle saving and loading data from
// localStorage so user progress is kept between sessions.

// Key name for saving app data to localStorage
const STORAGE_KEY = "habits_v4";

// Loads saved state from localStorage; if missing or invalid, returns an empty state
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
// These define how habits are created and managed in memory.

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
// Collecting all the key elements from the HTML for easy use.

// Cached DOM elements for performance and easy reuse
const rows = document.getElementById("rows"); // Container for all habit rows
const weekRange = document.getElementById("week-range"); // Displays the 7-day range
const habitForm = document.getElementById("habit-form"); // Form for adding new habits
const habitInput = document.getElementById("habit-name"); // Text input for habit name
const exportBtn = document.getElementById("export-json"); // Button to export data
const importInput = document.getElementById("import-json"); // File input for importing JSON
const resetBtn = document.getElementById("reset-all"); // Button to reset app data
const darkModeToggle = document.getElementById("dark-mode-toggle"); // Toggle for dark/light mode
const errorMsg = document.getElementById("habit-error"); // Element for displaying form error messages

// ===========================================================================
// THE INITIALIZATION  STATE FOR LOCALSTORAGE AND RENDERING THE HABIT
// ===========================================================================

// Load existing habits from localStorage and set up date range.
let state = loadState();

// Generate list of date keys for the previous week
const weekKeys = last7Keys();
weekRange.textContent = `${weekKeys[0]} to ${weekKeys[6]}`;

// =========================
//  FOR RENDERING FUNCTION
// =========================
// These functions visually update the habit table in the browser.

// Rebuilds the entire list of habits in the UI.
// If no habits exist, it calls a separate function to display a placeholder.
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

// Main render function – rebuilds the entire table the "No habits yet" placeholder row
function renderEmptyRow() {
  const row = document.createElement("div");
  row.className = "habit-row";

  // Habit name
  const nameCol = document.createElement("div");
  nameCol.className = "habit-name";
  nameCol.textContent = "No habits yet";
  row.appendChild(nameCol);

  // Creating buttons for the past 7 days
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

// Renders one habit row — including:
// habit name, daily toggle buttons, streak count, and “Tick Today/Delete” buttons.
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

  // Column showing current streak count
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

// Handles clicking a day cell button (When a user clicks a day cell, toggle the habit’s log for the corresponding date.)
function onToggleDay(e) {
  const btn = e.currentTarget;
  toggleLog(btn.dataset.habitId, btn.dataset.dateKey);
}

// Toggles (checks/unchecks) the specified day for the given habit.
// Updates localStorage and re-renders the UI immediately.
function toggleLog(habitId, dateKey) {
  const habit = state.habits.find((h) => h.id === habitId);
  if (!habit) return;

  // Remove date if already checked, otherwise add it
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
  e.preventDefault(); // prevent reload on submit
  const name = habitInput.value.trim();
  errorMsg.style.display = "none"; // Hide previous error

  // Validate non-empty name F
 if (!name) {
    errorMsg.textContent = "Please enter a habit name.";
    errorMsg.style.display = "block";
    return;
  }

  // Check if the habit name already exists (case-insensitive)
  const exists = state.habits.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    errorMsg.textContent = `Habit "${name}" already exists.`;
    errorMsg.style.display = "block";
    habitInput.value = "";
    return;
  }

  // Add new habit if not existing F
  state.habits.push(newHabit(name));
  saveState(state);
  habitInput.value = "";
  errorMsg.style.display = "none"; // Hide error
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

// Import: Reads and loads habits from a selected user-provided JSON file
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

// Reset: Clears all saved data after user confirmation (clears localStorage)
resetBtn.addEventListener("click", () => { // Confirm before resetting all data
  if (!confirm("Remove all habits and logs from this browser?")) return;
  state = { habits: [] };
  saveState(state);
  render();
});

// =========================
//  DARK MODE TOGGLE
// =========================

// Initializes and manages dark mode preference using localStorage persistence.
// The toggle button switches between light and dark themes visually and saves preference.
(function initDarkMode() {
  const pref = localStorage.getItem("darkMode") === "true";
  if (pref) document.body.classList.add("dark");

  darkModeToggle.addEventListener("click", () => { // Toggle dark mode on button click
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
