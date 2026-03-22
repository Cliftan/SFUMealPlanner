// pages/Schedule.jsx
import { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import menu from "../data/menu.json";

const STEPS = {
  NO_SCHEDULE: "noSchedule",
  SCHEDULE_FORM: "scheduleForm",
  BUDGET: "budget",
  GENERATING: "generating",
  OPTIONS: "options",
  CONFIRM: "confirm",
};

const STORAGE_KEY = "sfu-meal-plan-week";
const WEEK_DAYS = ["March 9", "March 10", "March 11", "March 12", "March 13"];

function newMealId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Schedule() {
  const [step, setStep] = useState(STEPS.NO_SCHEDULE);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [days, setDays] = useState(
    WEEK_DAYS.map((label) => ({
      label,
      startTime: "",
      endTime: "",
      campus: "Burnaby Campus",
      meals: [
        {
          id: newMealId(),
          mealStartTime: "",
          mealDurationMinutes: "",
        },
      ],
    }))
  );
  const [budget, setBudget] = useState(20);
  const [options, setOptions] = useState([]);
  const [selectedByDay, setSelectedByDay] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currentDay = days[currentDayIndex];

  // Simple mock meal plan generator
  const generateMealPlan = async ({ schedule, budget, preferences, menu }) => {
    const campus = menu.campuses?.[0];
    if (!campus) return { items: [] };
    return {
      source: "mock",
      items: campus.restaurants.flatMap((r) =>
        r.items.slice(0, 3).map((item) => ({
          ...item,
          restaurant: r.name,
          campus: campus.name,
        }))
      ),
    };
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          {step === STEPS.NO_SCHEDULE && (
            <div className="section-card">
              <h2 className="section-title">Edit Your Schedule</h2>
              <p className="card-text">
                You haven&apos;t planned your meals for <br />
                March 9 - March 13
              </p>
              <button
                className="section-button"
                type="button"
                onClick={() => setStep(STEPS.SCHEDULE_FORM)}
              >
                Create Schedule
              </button>
            </div>
          )}

          {step === STEPS.SCHEDULE_FORM && (
            <div className="flow-card">
              <h2 className="section-title">Schedule</h2>
              <p className="flow-subtitle">
                Enter your schedule information to generate your meal plan.
              </p>
              <div className="flow-row">
                <button
                  type="button"
                  className="day-arrow"
                  disabled={currentDayIndex === 0}
                  onClick={() =>
                    setCurrentDayIndex((i) => Math.max(0, i - 1))
                  }
                >
                  ‹
                </button>
                <select
                  className="flow-text-input day-select"
                  value={currentDay.label}
                  onChange={(e) => {
                    const idx = WEEK_DAYS.indexOf(e.target.value);
                    if (idx !== -1) setCurrentDayIndex(idx);
                  }}
                >
                  {WEEK_DAYS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="day-arrow"
                  disabled={currentDayIndex === WEEK_DAYS.length - 1}
                  onClick={() =>
                    setCurrentDayIndex((i) =>
                      Math.min(WEEK_DAYS.length - 1, i + 1)
                    )
                  }
                >
                  ›
                </button>
              </div>

              <div className="flow-field">
                <span className="flow-label">Start Time</span>
                <input
                  className="flow-text-input"
                  type="time"
                  value={currentDay.startTime}
                  onChange={(e) =>
                    setDays((prev) =>
                      prev.map((day, idx) =>
                        idx === currentDayIndex
                          ? { ...day, startTime: e.target.value }
                          : day
                      )
                    )
                  }
                />
              </div>
              <div className="flow-field">
                <span className="flow-label">End Time</span>
                <input
                  className="flow-text-input"
                  type="time"
                  value={currentDay.endTime}
                  onChange={(e) =>
                    setDays((prev) =>
                      prev.map((day, idx) =>
                        idx === currentDayIndex
                          ? { ...day, endTime: e.target.value }
                          : day
                      )
                    )
                  }
                />
              </div>
              <div className="flow-field">
                <span className="flow-label">Campus</span>
                <select
                  className="flow-text-input"
                  value={currentDay.campus}
                  onChange={(e) =>
                    setDays((prev) =>
                      prev.map((day, idx) =>
                        idx === currentDayIndex
                          ? { ...day, campus: e.target.value }
                          : day
                      )
                    )
                  }
                >
                  {menu.campuses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {currentDay.meals.map((meal, idx) => (
                <div key={meal.id} className="flow-meal-block">
                  <div className="flow-field">
                    <span className="flow-label">
                      Meal {idx + 1} Start Time
                    </span>
                    <input
                      className="flow-text-input"
                      type="time"
                      value={meal.mealStartTime}
                      onChange={(e) =>
                        setDays((prev) =>
                          prev.map((day, dIdx) =>
                            dIdx !== currentDayIndex
                              ? day
                              : {
                                  ...day,
                                  meals: day.meals.map((m) =>
                                    m.id === meal.id
                                      ? {
                                          ...m,
                                          mealStartTime: e.target.value,
                                        }
                                      : m
                                  ),
                                }
                          )
                        )
                      }
                    />
                  </div>
                  <div className="flow-field">
                    <span className="flow-label">Meal Duration (minutes)</span>
                    <input
                      className="flow-text-input"
                      type="number"
                      min="0"
                      value={meal.mealDurationMinutes}
                      onChange={(e) =>
                        setDays((prev) =>
                          prev.map((day, dIdx) =>
                            dIdx !== currentDayIndex
                              ? day
                              : {
                                  ...day,
                                  meals: day.meals.map((m) =>
                                    m.id === meal.id
                                      ? {
                                          ...m,
                                          mealDurationMinutes: e.target.value,
                                        }
                                      : m
                                  ),
                                }
                          )
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                className="flow-secondary-button"
                type="button"
                onClick={() =>
                  setDays((prev) =>
                    prev.map((day, idx) =>
                      idx !== currentDayIndex
                        ? day
                        : {
                            ...day,
                            meals: [
                              ...day.meals,
                              {
                                id: newMealId(),
                                mealStartTime: "",
                                mealDurationMinutes: "",
                              },
                            ],
                          }
                    )
                  )
                }
              >
                + Add Additional Meal
              </button>

              <div className="flow-footer">
                <button
                  type="button"
                  className="flow-ghost-button"
                  onClick={() => setStep(STEPS.NO_SCHEDULE)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="flow-primary-button"
                  onClick={() => setStep(STEPS.BUDGET)}
                >
                  Next
                </button>
              </div>

              <div className="flow-howto">
                <h3 className="flow-howto-title">How-To</h3>
                <p className="flow-howto-text">
                  Fill out your schedule so we know when and where you&apos;ll be
                  on campus. We&apos;ll use this to plan your meals.
                </p>
              </div>
            </div>
          )}

          {step === STEPS.BUDGET && (
            <div className="flow-card">
              <h2 className="section-title">Budget</h2>
              <p className="flow-subtitle">
                Adjust your weekly budget to match your needs.
              </p>

              <div className="flow-budget-row">
                <span className="flow-label">Budget ($)</span>
                <input
                  type="number"
                  min="0"
                  className="flow-text-input flow-budget-input"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                />
              </div>

              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={budget}
                className="flow-slider-input"
                onChange={(e) => setBudget(Number(e.target.value))}
              />

              <div className="flow-presets">
                {[20, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="flow-preset-button"
                    onClick={() => setBudget(value)}
                  >
                    ${value}
                  </button>
                ))}
              </div>

              <div className="flow-footer">
                <button
                  type="button"
                  className="flow-ghost-button"
                  onClick={() => setStep(STEPS.SCHEDULE_FORM)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="flow-primary-button"
                  onClick={async () => {
                    setStep(STEPS.GENERATING);
                    setIsLoading(true);
                    const result = await generateMealPlan({
                      schedule: days,
                      budget,
                      preferences: {},
                      menu,
                    });
                    const items = result.items || [];
                    setOptions(items);
                    setIsLoading(false);
                    setStep(STEPS.OPTIONS);
                  }}
                >
                  Next
                </button>
              </div>

              <div className="flow-howto">
                <h3 className="flow-howto-title">How-To</h3>
                <p className="flow-howto-text">
                  Type a budget, use the slider, or pick a preset.
                </p>
              </div>
            </div>
          )}

          {step === STEPS.GENERATING && (
            <div className="flow-card flow-card-centered">
              <h2 className="section-title">Generating options...</h2>
              <div className="flow-circle-outline">
                <div className="flow-circle-inner" />
              </div>
              <p className="flow-generating-text">
                {isLoading
                  ? "We’re creating a meal plan that fits your schedule and budget."
                  : "Almost there—loading meal options."}
              </p>
            </div>
          )}

          {step === STEPS.OPTIONS && (
            <div className="flow-card">
              <h2 className="section-title">Choose Your Meals</h2>
              <p className="flow-subtitle">
                Pick a combination of meals that works for you.
              </p>

              <div className="flow-row">
                <span className="flow-label">
                  {currentDay.label} · {currentDay.campus}
                </span>
              </div>

              {options.map((item) => {
                const selectedForDay = selectedByDay[currentDay.label] || [];
                const isSelected = selectedForDay.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      "option-card option-card-selectable" +
                      (isSelected ? " option-card-selected" : "")
                    }
                    onClick={() =>
                      setSelectedByDay((prev) => {
                        const current = prev[currentDay.label] || [];
                        const next = current.includes(item.id)
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id];
                        return {
                          ...prev,
                          [currentDay.label]: next,
                        };
                      })
                    }
                  >
                    <div className="option-image" />
                    <div className="option-content">
                      <h3 className="option-title">{item.name}</h3>
                      <p className="option-meta">
                        {item.restaurant} · ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </button>
                );
              })}

              <div className="flow-footer">
                <button
                  type="button"
                  className="flow-ghost-button"
                  onClick={() => setStep(STEPS.BUDGET)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="flow-primary-button"
                  onClick={() => setStep(STEPS.CONFIRM)}
                >
                  Next
                </button>
              </div>

              <div className="flow-howto">
                <h3 className="flow-howto-title">How-To</h3>
                <p className="flow-howto-text">
                  Select the meals you prefer for each day using the day picker
                  above.
                </p>
              </div>
            </div>
          )}

          {step === STEPS.CONFIRM && (
            <div className="flow-card">
              <h2 className="section-title">Review Your Plan</h2>
              <p className="flow-subtitle">
                Week overview · {days[0].label} – {days[days.length - 1].label}
              </p>

              <div className="plan-grid">
                {days.map((day) => {
                  const selectedIds = selectedByDay[day.label] || [];
                  const selectedItems = options.filter((item) =>
                    selectedIds.includes(item.id)
                  );
                  if (!selectedItems.length) return null;

                  return (
                    <div key={day.label} className="plan-column">
                      <h3 className="plan-day">{day.label}</h3>
                      {selectedItems.map((item) => (
                        <div key={item.id} className="plan-card">
                          <div className="plan-row">
                            <span>Meal</span>
                            <span>{item.name}</span>
                          </div>
                          <div className="plan-row">
                            <span>Location</span>
                            <span>{item.restaurant}</span>
                          </div>
                          <div className="plan-row">
                            <span>Price</span>
                            <span>${Number(item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              <div className="flow-footer">
                <button
                  type="button"
                  className="flow-ghost-button"
                  onClick={() => setStep(STEPS.OPTIONS)}
                >
                  Back
                </button>
                <button
                  className="flow-primary-button"
                  type="button"
                  onClick={() => {
                    const payload = {
                      days,
                      budget,
                      options,
                      selectedByDay,
                    };
                    try {
                      window.localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(payload)
                      );
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Confirm
                </button>
              </div>

              <div className="flow-howto">
                <h3 className="flow-howto-title">How-To</h3>
                <p className="flow-howto-text">
                  Review your meals for the week. You can always come back and
                  edit your schedule or budget later.
                </p>
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
