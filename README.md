# Habit Tracker

[![Habit_Tracker](https://github.com/FemiAdesola/Habit_Tracker/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/FemiAdesola/Habit_Tracker/actions)

A simple **client-side Habit Tracker** built with **HTML, CSS, and Vanilla JavaScript**.

> The Habit Tracker helps users build consistency, visualize streaks, monitor progress, stay motivated, develop discipline, visualize improvement, and maintain accountability for achieving personal growth goals.

> The instructions provided here apply to both Windows and Mac users.

<code style="color : greenyellow"><strong>View the website link [here](https://femi-oyinloye-habit-tracker.netlify.app) and GitHub site [here](https://femiadesola.github.io/Habit_Tracker/)</strong></code>

## Installation / Setup
1. Clone or download this repository:
```bash
   git clone https://github.com/FemiAdesola/Habit_Tracker 
```
   Or download the ZIP file and extract it.

2. Navigate to folder: 
```bash 
    cd Habit_Tracker
```
3. Open `index.html` in your browser.

Windows (CMD)
```bash
mkdir Habit_Tracker
cd Habit_Tracker 
code .   REM opens VS Code if available 
```

macOS (Terminal)
```bash
mkdir -p Habit_Tracker
cd Habit_Tracker
code .   # opens VS Code if available
```

## Demo

Simply open `index.html` in your browser. All data is stored locally using `localStorage`.

---
## Tech Stack
- HTML5
- CSS3 (custom properties, responsive layout)
- **Vanilla JS only** — no frameworks, just modern JavaScript  
- **LocalStorage persistence** — all data (habits, streaks, and theme) is saved locally  
---

## Front page
| Desktop view | Mobile view|
|-------------|--------------|
| ![Habit Tracker](/img/HabitPage.png) | ![MobileView](/img/MobileView.png) |


> The image is a screenshot of a digital habit tracker. It shows a weekly view of a habits being tracked: "Bible Study". The tracker allows users to mark days as complete and displays a streak count.
  * The habits being tracked is "Bible Study."
  * The time frame shown is the week from October 18 to October 24, 2025.
  * The streak counts is 12 for "Bible Study."
  * The interface includes options to add new habits, tick off days, and delete habits.
---

## Project Structure
```bash

HABIT_TRACKER-T/
├── .github/
│   └── workflows/      # Contains GitHub Actions workflow files
│       ├── ci.yml      # Continuous Integration (CI) pipeline
│       └── pages.yml   # GitHub actions CI/CD
├── assets/
│   ├── favicon.ico
│   └── style.css      # Stylesheet (main CSS file that defines the visual styling of the web application)
├── img/                # Contains image assets used in the application.
│   ├── ErrorMessage.png
│   ├── FrontDark.png
│   ├── FrontLight.png
│   ├── GitHub.png
│   ├── HabitPage.png
│   ├── JSON.png
│   └── MobileView.png
├── js/
│   └── app.js       # JavaScript logic
├── .gitignore
├── .md
├── .eslint.config.mjs
├── index.html            # Main HTML file
├── package-lock.json
├── package.json        #
└── README.md           # Project documentation
```
---

## Features

- Add, delete, and tick habits  
- View a **weekly overview** with streak tracking  
- Keyboard accessible (Tab + Enter/Space to toggle)  
- **Export** and **Import JSON** for backup  
- Reset all habits with one click  
- Manual **dark mode toggle** (saved in localStorage)  
- Fully responsive and mobile-friendly
-  Merge **existing** file with **newly import** file
- **Persistent theme toggle** — remembers the dark/light preference  
---

## Usage

### Adding a Habit

1. Enter the habit name in the input field under "Add a habit".
2. Click **Add** or press **Enter**.
3. The habit appears in the weekly tracker.
4. Duplicate name check
  * If the user enters a duplicate name → A red message appears under the input box
  
  ![errorMessage](/img/ErrorMessage.png)

### Ticking a Habit

- Click the day button to toggle completion.
- Use **Tab** to focus a day button, then press **Space** or **Enter** to mark it.
- Possibility to toggle only day before today

### Viewing Streaks

- The **Streak** column shows consecutive days completed for each habit.

### Export / Import Data

- **Export JSON**: Downloads your current habits and logs.

### Toggling Theme
- Click the **🌙 / ☀️** icon in the header  to switch themes.
  * The preference is saved automatically.

#### Exporting  Data
> You can export the entire habit list and progress to a JSON file.

+ Example:
   * Click Export Data (the **Export** button).
   * A file named habits-export.json will download automatically.
```json
   {
  "habits": [
    {
      "id": "898ad458-e3a0-4901-935d-f894949750ba",
      "name": "Exercise",
      "createdOn": "2025-10-10",
      "log": {
        "2025-10-10": true,
        "2025-10-11": true,
        "2025-10-12": false
      }
    },
    {
      "id": "898ad458-e3a0-4901-935d-f894949750bc",
      "name": "Read 10 pages",
      "createdOn": "2025-10-08",
      "log": {
        "2025-10-08": true,
        "2025-10-09": true
      }
    }
  ]
}
```
#### Importing Data
- **Import JSON**: Upload a JSON file exported previously to restore habits.
+ To restore previously exported habits:
   * Click the Import JSON button.
   * Choose a file like habits-export.json.
   * The app will automatically load and display the saved habits.

* Example of Valid Import File
   + Make sure your JSON matches this structure:
```json
{
  "habits": [
    {
      "id": "898ad458-e3a0-4901-935d-f894949750b0",
      "name": "Meditate",
      "createdOn": "2025-10-01",
      "log": {
        "2025-10-13": true,
        "2025-10-14": true
      }
    }
  ]
}

```
Example from export JSON file
![JSON file](/img/JSON.png)
---
### Reset All

- **Reset all** removes all habits and logs permanently from your browser.

---

## Dark and Light Theme

| Dark Theme | Light Theme |
|-------------|--------------|
| ![Dark mode](/img/FrontDark.png) | ![Light mode](/img/FrontLight.png) |

---

## Browser Support

- Modern browsers with **localStorage** support.
- Tested on Chrome, Firefox, Edge, and Safari.

---
## Steps to Add the GitHub Actions Badge (Habit Tracker)
### Step 1: Create a GitHub Actions Workflow
+ In your project, create to:
  * .github/workflows/
+ Create a new file (if not already present):
  * pages.yml
- Add the GitHub Pages deployment workflow — for example:\
[pages.yml](.github/workflows/pages.yml)

- Commit and push the new workflow file

### Step 2: Add Badge to README.md
- Open README.md file and paste the markdown snippet at the top (usually below the project title).
  * Example
```markdown
  # Habit Tracker

[![Habit_Tracker](https://github.com/FemiAdesola/Habit_Tracker/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/FemiAdesola/Habit_Tracker/actions)

```

### Step 3: Check the Actions on GitHub
- On GitHub open the repository
  * go to Actions then 
  * Click on Deploy Pages

### Step 4: Verify the Badge
- Push your updated README to GitHub.
- Open your repository’s main page.
- The badge should now appear — showing:
  * ✅ Passing (green) when the workflow succeeds.
  * ❌ Failing (red) if the workflow encounters an error.

+ Result from GitHub 
![GitHub](/img/GitHub.png)
---

## GitHub Pages Deployment
1. Push repo to GitHub
2. Settings → Pages → Branch: main, folder: root (/)
3. Access at: `https://femiadesola.github.io/Habit_Tracker/`

## Notes

- Data is stored locally; clearing browser storage will erase your habits.
- If ticks do not persist, check that localStorage is allowed (not in private mode).

---

## 🧾 License

MIT License [Femi Adesola Oyinloye](https://github.com/FemiAdesola) © 2025 

Feel free to fork, modify, and share!