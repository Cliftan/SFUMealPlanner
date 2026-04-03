const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function ScheduleGenerate(schedule, budget, amount, menu) {
  // Build a day-by-day instruction so the AI can't miscount
  const dayInstructions = schedule
    .map((day, i) => {
      if (day.skipDay) {
        return `Day ${i} (${day.label}): skipDay=true → return []`;
      }
      return `Day ${i} (${day.label}): campus=${day.campus}, skipDay=false → return 3-4 meal options from campus "${day.campus}"`;
    })
    .join("\n");

  const message = `
You are a meal planner. Return ONLY a JSON array — no explanation, no markdown, no backticks.

MENU (choose only from these items):
${JSON.stringify(menu)}

DAYS (there are exactly ${schedule.length} days, indexed 0 to ${schedule.length - 1}):
${dayInstructions}

BUDGET: $${budget} total (amount already used: $${amount})

RULES:
1. Your response must be a JSON array with EXACTLY ${schedule.length} elements.
2. Element at index 0 = Day 0, index 1 = Day 1, etc. Do NOT skip indices.
3. For days marked "return []", the element must be an empty array [].
4. For other days, the element must be an array of 3-4 meal objects from the menu above.
5. Only use items whose "campus" field matches the day's campus.
6. Do not exceed the budget. Track cumulative price as you pick items.
7. Copy each chosen object exactly as-is from the menu — do not change any fields.
8. Do not add backticks, the word "json", or any text outside the array.

EXAMPLE of correct output shape for a 3-day schedule where day 1 is skipped:
[ [...meals...], [], [...meals...] ]

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
      // Strip any accidental markdown fences the model still adds
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