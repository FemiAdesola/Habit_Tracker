# Habit Tracker

A simple **client-side Habit Tracker** built with **HTML, CSS, and Vanilla JavaScript**.

> The Habit Tracker helps users build consistency, visualize streaks, monitor progress, stay motivated, develop discipline, visualize improvement, and maintain accountability for achieving personal growth goals.

> The instructions provided here apply to both Windows and Mac users.

<code style="color : greenyellow"><strong>View the website link [here](https://femi-oyinloye-habit-tracker.netlify.app)</strong></code>

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

---

## Project Structure
```bash
HABIT_TRACKER-T
├── assets
│   └── style.css       # Stylesheet
├── img
│   ├── FrontDark.png
│   ├── FrontDark.png
│   ├── HabitPage.png
│   ├── JSON.png
│   └── MobileView.png
├── js
│   └── app.js       # JavaScript logic
├── .gitignore
├── index.html      # Main HTML file
└── README.md       # Project documentation
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
- **Persistent theme toggle** — remembers the dark/light preference  
---

## Usage

### Adding a Habit

1. Enter the habit name in the input field under "Add a habit".
2. Click **Add** or press **Enter**.
3. The habit appears in the weekly tracker.

### Ticking a Habit

- Click the day button to toggle completion.
- Use **Tab** to focus a day button, then press **Space** or **Enter** to mark it.

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

## GitHub Pages Deployment
1. Push repo to GitHub
2. Settings → Pages → Branch: main, folder: root (/)
3. Access at: `https://femiadesola.github.io/Habit_Tracker/`


## Notes

- Data is stored locally; clearing browser storage will erase your habits.
- If ticks do not persist, check that localStorage is allowed (not in private mode).

---