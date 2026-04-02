## SFU Meal Planner

SFU Meal Planner is a mobile‑style React app (built with Vite) that helps SFU students plan budget‑friendly meals on campus.  
Users enter their class schedule and weekly budget, set diet and cuisine preferences, and the app suggests meals based on campus restaurant menus (from a JSON file and optionally the Gemini API).

### Features

- **Home**
  - Week‑at‑a‑glance card.
  - After planning, shows the saved weekly meal schedule.
  - Budget summary card and promotions list.
- **Schedule**
  - Multi‑day schedule for a week (date selector + left/right arrows).
  - For each day: campus, start/end times, and one or more meal slots (time + duration).
  - Weekly budget selector with quick‑select presets and manual numeric entry.
  - Generates meal options using `menu.json` and (optionally) Gemini.
  - Users select meals per day and confirm a weekly plan (stored in `localStorage`).
- **Analytics**
  - Circular “chart” cards summarizing:
    - Total planned spend vs budget.
    - Most‑visited restaurants in the current plan.
- **Restaurants**
  - Searchable list of campus restaurants backed by `src/data/menu.json`.
- **Chat**
  - Preference chatbot UI: quick preference chips and free‑text input for calories, allergies, cuisines, etc.
  - Currently uses a local echo response; ready to be wired to Gemini.
- **Settings**
  - Editable lists for diet restrictions, preferred foods, and foods to avoid.
  - Users can add/remove items as chips.
- **Help**
  - Overview of how each tab works and tips for using the planner.

### Tech stack

- React + Vite
- React Router for tab/style navigation
- Plain CSS (`App.css`) for the mobile app frame and cards

### Getting started

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL in your browser.

### Gemini setup

1. Create `.env.local` in the project root (already added to this repo) and set:

   ```bash
   VITE_GEMINI_API_KEY=your_real_gemini_key_here
   ```

2. Restart the dev server after changing env values:

   ```bash
   npm run dev
   ```

### Menu data

- Restaurant and menu information lives in `src/data/menu.json`.
- Structure:

  ```json
  {
    "campuses": [
      {
        "id": "burnaby",
        "name": "Burnaby Campus",
        "restaurants": [
          {
            "id": "tripleos",
            "name": "Triple-O's",
            "category": "Burgers",
            "items": [
              {
                "id": "taco-burger-combo",
                "name": "Taco Burger Combo",
                "price": 13.49,
                "calories": 850,
                "dietTags": ["beef"],
                "description": "Burger with fries and a drink."
              }
            ]
          }
        ]
      }
    ]
  }
  ```

Add or update campuses, restaurants, and items here; both the Restaurants page and the planner use this file.

