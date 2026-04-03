const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function ScheduleGenerate(schedule, budget, amount, menu) {
  // Build meal-slot-level instructions so the AI generates unique options per meal
  const dayInstructions = schedule
    .map((day, i) => {
      if (day.skipDay) {
        return `Day ${i} (${day.label}): skipDay=true → return []`;
      }
      const mealSlots = day.meals
        .map(
          (meal, j) =>
            `  Meal slot ${j} (starts ${meal.mealStartTime || "TBD"}, ${meal.mealDurationMinutes || "?"}min): return 3-4 DIFFERENT options from campus "${day.campus}"`,
        )
        .join("\n");
      return `Day ${i} (${day.label}): campus=${day.campus}, skipDay=false, has ${day.meals.length} meal slot(s):\n${mealSlots}`;
    })
    .join("\n");

  const message = `
You are a meal planner. Return ONLY a JSON array — no explanation, no markdown, no backticks.

MENU (choose only from these items):
${JSON.stringify(menu)}

DAYS (there are exactly ${schedule.length} days, indexed 0 to ${schedule.length - 1}):
${dayInstructions}

BUDGET: $${budget} total (amount already used: $${amount})

OUTPUT SHAPE:
- The outer array has EXACTLY ${schedule.length} elements (one per day).
- For a skipped day, the element is [].
- For an active day, the element is an array of meal-slot arrays — one inner array per meal slot on that day.
- Each meal-slot array contains 3-4 meal option objects chosen from the menu.
- Meal slots on the same day MUST have DIFFERENT sets of options — do not repeat the same items across slots.

EXAMPLE for a 2-day schedule where day 0 has 2 meal slots and day 1 is skipped:
[
  [ [...3-4 options for day0 meal0...], [...3-4 DIFFERENT options for day0 meal1...] ],
  []
]

RULES:
1. Outer array length = EXACTLY ${schedule.length}.
2. Active day element length = number of meal slots for that day.
3. Only use items whose "campus" field matches the day's campus.
4. Do not exceed the budget across all selections.
5. Copy each chosen object exactly as-is from the menu — do not change any fields.
6. Do not add backticks, the word "json", or any text outside the array.

Your response (the array only, nothing else):
`.trim();

  const apiRequestBody = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      let text = data.choices[0].message.content;
      text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      return text;
    } else {
      console.error("Unexpected API response format:", data);
      return JSON.stringify(schedule.map(() => []));
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return JSON.stringify(schedule.map(() => []));
  }
}