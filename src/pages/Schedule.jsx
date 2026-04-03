// pages/Schedule.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import menu from "../menus.json";
import leftArrowActive from "../Resources/Icons/leftarrow_active.png";
import leftArrowInactive from "../Resources/Icons/leftarrow_inactive.png";
import rightArrowActive from "../Resources/Icons/rightarrow_active.png";
import rightArrowInactive from "../Resources/Icons/rightarrow_inactive.png";
import progressBar1 from "../Resources/Icons/ProgressBar_1.png";
import progressBar2 from "../Resources/Icons/ProgressBar_2.png";
import progressBar3 from "../Resources/Icons/ProgressBar_3.png";
import progressBar4 from "../Resources/Icons/ProgressBar_4.png";
import { ScheduleGenerate } from "../scheduleGen";

const STEPS = {
  NO_SCHEDULE: "noSchedule",
  SCHEDULE_FORM: "scheduleForm",
  BUDGET: "budget",
  GENERATING: "generating",
  OPTIONS: "options",
  CONFIRM: "confirm",
};

const STORAGE_KEY = "sfu-meal-plan-week";

const CAMPUS = ["Burnaby", "Surrey"];

function getThisWeekMonday(today = new Date()) {
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

function getWeekDayLabels() {
  const monday = getThisWeekMonday();
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return formatDayLabel(d);
  });
}

function newMealId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Schedule() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.NO_SCHEDULE);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentMealIndexInDay, setCurrentMealIndexInDay] = useState(0);
  const [days, setDays] = useState(() =>
    getWeekDayLabels().map((label) => ({
      label,
      campus: "Burnaby",
      skipDay: false,
      meals: [
        {
          id: newMealId(),
          mealStartTime: "",
          mealDurationMinutes: "",
        },
      ],
    })),
  );
  const [budget, setBudget] = useState(20);
  const [options, setOptions] = useState([]);
  const [expandedHowTo, setExpandedHowTo] = useState(null);
  const [budgetHowToExpanded, setBudgetHowToExpanded] = useState(false);
  const [optionsHowToExpanded, setOptionsHowToExpanded] = useState(false);
  const [selectedByDay, setSelectedByDay] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if there's an existing schedule in localStorage
  const hasExistingSchedule = (() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed.days && parsed.days.length > 0;
    } catch {
      return false;
    }
  })();

  const currentDay = days[currentDayIndex];

  // Safe accessor — always returns an array even if options is misaligned
  const getOptionsForDay = (dayIndex) => {
    const dayOptions = options[dayIndex];
    return Array.isArray(dayOptions) ? dayOptions : [];
  };

  const generateMealPlan = async ({ schedule, budget, used, menu }) => {
    const result = await ScheduleGenerate(schedule, budget, used, menu);
    console.log(result);
    return result;
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
                {hasExistingSchedule
                  ? "Update your current meal schedule for the week"
                  : `You haven't planned your meals for ${days[0]?.label} - ${days[days.length - 1]?.label}`}
              </p>
              <button
                className="section-button"
                type="button"
                onClick={() => setStep(STEPS.SCHEDULE_FORM)}
              >
                {hasExistingSchedule ? "Edit Schedule" : "Create Schedule"}
              </button>
            </div>
          )}

          {step === STEPS.SCHEDULE_FORM && (
            <div className="flow-card">
              <h2 className="section-title">Schedule</h2>
              <p className="flow-subtitle">
                Specify when you want your meal breaks to start, on which
                campus, and how long they will last.
              </p>

              {/* Day Navigation */}
              <div className="day-nav">
                <button
                  type="button"
                  className="day-arrow"
                  disabled={currentDayIndex === 0}
                  onClick={() => setCurrentDayIndex((i) => Math.max(0, i - 1))}
                  aria-label="Previous day"
                >
                  <img
                    src={
                      currentDayIndex === 0
                        ? leftArrowInactive
                        : leftArrowActive
                    }
                    alt=""
                  />
                </button>
                <span className="day-label">{currentDay.label}</span>
                <button
                  type="button"
                  className="day-arrow"
                  disabled={currentDayIndex === days.length - 1}
                  onClick={() =>
                    setCurrentDayIndex((i) => Math.min(days.length - 1, i + 1))
                  }
                  aria-label="Next day"
                >
                  <img
                    src={
                      currentDayIndex === days.length - 1
                        ? rightArrowInactive
                        : rightArrowActive
                    }
                    alt=""
                  />
                </button>
              </div>

              {/* Form Fields */}
              <div className="schedule-fields">
                <div className="form-field">
                  <label className="form-label">Campus:</label>
                  <select
                    className="form-input"
                    value={currentDay.campus}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((day, idx) =>
                          idx === currentDayIndex
                            ? { ...day, campus: e.target.value }
                            : day,
                        ),
                      )
                    }
                    disabled={currentDay.skipDay}
                  >
                    {CAMPUS.map((e, i) => (
                      <option key={i} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={currentDay.skipDay}
                      onChange={(e) =>
                        setDays((prev) =>
                          prev.map((day, idx) =>
                            idx === currentDayIndex
                              ? { ...day, skipDay: e.target.checked }
                              : day,
                          ),
                        )
                      }
                    />
                    Skip this day (no meals needed)
                  </label>
                </div>

                {!currentDay.skipDay && (
                  <>
                    {currentDay.meals.map((meal, mealIndex) => (
                      <div key={meal.id} className="meal-input-group">
                        <div className="form-field">
                          <label className="form-label">
                            Meal {mealIndex + 1} Start Time:
                          </label>
                          <select
                            className="form-input"
                            value={meal.mealStartTime}
                            onChange={(e) => {
                              const newMeals = [...currentDay.meals];
                              newMeals[mealIndex] = {
                                ...meal,
                                mealStartTime: e.target.value,
                              };
                              setDays((prev) =>
                                prev.map((day, idx) =>
                                  idx === currentDayIndex
                                    ? { ...day, meals: newMeals }
                                    : day,
                                ),
                              );
                            }}
                          >
                            <option value="">Select time</option>
                            <option value="08:00">8:00 AM</option>
                            <option value="08:30">8:30 AM</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="09:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="12:30">12:30 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:30">3:30 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="16:30">4:30 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <option value="19:00">7:00 PM</option>
                            <option value="20:00">8:00 PM</option>
                          </select>
                        </div>

                        <div className="form-field">
                          <label className="form-label">
                            Meal {mealIndex + 1} Duration:
                          </label>
                          <select
                            className="form-input"
                            value={meal.mealDurationMinutes}
                            onChange={(e) => {
                              const newMeals = [...currentDay.meals];
                              newMeals[mealIndex] = {
                                ...meal,
                                mealDurationMinutes: e.target.value,
                              };
                              setDays((prev) =>
                                prev.map((day, idx) =>
                                  idx === currentDayIndex
                                    ? { ...day, meals: newMeals }
                                    : day,
                                ),
                              );
                            }}
                          >
                            <option value="">Select duration</option>
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                          </select>
                        </div>

                        {mealIndex > 0 && (
                          <button
                            type="button"
                            className="remove-meal-button"
                            onClick={() => {
                              const newMeals = currentDay.meals.filter(
                                (_, idx) => idx !== mealIndex,
                              );
                              setDays((prev) =>
                                prev.map((day, idx) =>
                                  idx === currentDayIndex
                                    ? { ...day, meals: newMeals }
                                    : day,
                                ),
                              );
                            }}
                          >
                            Remove Meal
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add Meal Button */}
                    <div className="add-meal-container">
                      <button
                        className="add-meal-button"
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
                                  },
                            ),
                          )
                        }
                      >
                        + Add Additional Meal
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Step Indicator */}
              <div className="step-indicator">
                <img src={progressBar1} alt="Step Indicator" />
              </div>

              {/* Navigation Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => setStep(STEPS.NO_SCHEDULE)}
                  aria-label="Back"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="btn-next"
                  onClick={() => setStep(STEPS.BUDGET)}
                  aria-label="Next"
                >
                  ✓
                </button>
              </div>

              {/* Tips Section */}
              <div className="tips-section">
                <h3 className="tips-title">Tips</h3>
                <ul className="tips-list">
                  <li>
                    Try using the app over the weekend to plan out your entire
                    meal schedule for the following week!
                  </li>
                  <li>
                    If you want to plan multiple meals for one day, simply click
                    Add Additional Meal, and do not change the date.
                  </li>
                </ul>
              </div>

              {/* How-To Section */}
              <div className="howto-section">
                <h3
                  className="howto-title"
                  onClick={() =>
                    setExpandedHowTo(expandedHowTo === "main" ? null : "main")
                  }
                >
                  How-To
                  <svg
                    className={`howto-icon ${expandedHowTo === "main" ? "expanded" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
                {expandedHowTo === "main" && (
                  <div className="howto-content">
                    <div className="howto-subsection">
                      <p>
                        In order for SFU MealMap to offer possible meal options,
                        we will need to know the times that you will be on
                        campus for the week. You will need to fill in all of the
                        dropdown menus.
                      </p>
                      <p>
                        <strong>Step 1:</strong> Select the start and end time
                        of when you will be on campus.
                      </p>
                      <p>
                        <strong>Step 2:</strong> Select the campus you will be
                        at.
                      </p>
                      <p>
                        <strong>Step 3:</strong> Select the estimated start time
                        of when you will want to order a meal and how long you
                        will have to dine.
                      </p>
                      <p>
                        <strong>Step 4:</strong> To add additional meals, click
                        the Add Additional Meal button, and click on the date at
                        the top to choose a different day for the week. Repeat
                        the steps until you have marked all of the different
                        blocks that you will be on campus.
                      </p>
                      <p>
                        <strong>Example:</strong> You have class from 10:30am -
                        12:20pm on Burnaby Campus, and want to schedule a 45
                        minute lunch block for 12:30pm. Select the following:
                      </p>
                      <ul>
                        <li>Start Time: 10:30am</li>
                        <li>End Time: 12:20pm</li>
                        <li>Campus: Burnaby</li>
                        <li>Meal Start Time: 12:30pm</li>
                        <li>Meal Duration: 45 minutes</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === STEPS.BUDGET && (
            <div className="flow-card">
              <h2 className="section-title">Budget</h2>
              <p className="flow-subtitle">
                Please select or enter your weekly budget for how much you would
                like to spend on:
              </p>

              {/* Budget Input Row */}
              <div className="budget-row">
                <label className="budget-label">Budget:</label>
                <input
                  type="number"
                  min="0"
                  className="budget-input-field"
                  placeholder="Enter Amount"
                  value={budget}
                  onChange={(e) => {
                    const newBudget = Number(e.target.value) || 0;
                    setBudget(newBudget);
                    try {
                      const raw = window.localStorage.getItem(STORAGE_KEY);
                      const parsed = raw ? JSON.parse(raw) : {};
                      parsed.budget = newBudget;
                      window.localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(parsed),
                      );
                    } catch {
                      // ignore
                    }
                  }}
                />
              </div>

              {/* Presets Label */}
              <div className="presets-label-row">
                <label className="presets-label">Presets:</label>
              </div>

              {/* Presets Grid */}
              <div className="presets-grid">
                {[20, 50, 75, 100, 125, 150].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`preset-btn ${budget === value ? "active" : ""}`}
                    onClick={() => {
                      setBudget(value);
                      try {
                        const raw = window.localStorage.getItem(STORAGE_KEY);
                        const parsed = raw ? JSON.parse(raw) : {};
                        parsed.budget = value;
                        window.localStorage.setItem(
                          STORAGE_KEY,
                          JSON.stringify(parsed),
                        );
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    ${value}
                  </button>
                ))}
              </div>

              {/* Step Indicator */}
              <div className="step-indicator">
                <img src={progressBar2} alt="Step Indicator" />
              </div>

              {/* Navigation Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => setStep(STEPS.SCHEDULE_FORM)}
                  aria-label="Back"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="btn-next"
                  onClick={async () => {
                    setStep(STEPS.GENERATING);
                    setIsLoading(true);

                    let items = days.map(() => []); // default: empty array per day
                    try {
                      const result = await generateMealPlan({
                        schedule: days,
                        budget,
                        used: 0,
                        menu,
                      });
                      const parsed = JSON.parse(result);
                      if (Array.isArray(parsed)) {
                        // Map parsed entries back onto days by index.
                        // If the AI returned fewer entries than days (the original bug),
                        // the missing indices fall back to [].
                        items = days.map((_, i) => {
                          const entry = parsed[i];
                          return Array.isArray(entry) ? entry : [];
                        });
                      }
                    } catch (err) {
                      console.error("Failed to parse meal plan:", err);
                      // items already defaulted to empty arrays above
                    }

                    setOptions(items);

                    // Start on the first day that isn't skipped and has options
                    const firstActiveDay = days.findIndex(
                      (d, i) => !d.skipDay && items[i]?.length > 0,
                    );
                    setCurrentDayIndex(firstActiveDay >= 0 ? firstActiveDay : 0);
                    setCurrentMealIndexInDay(0);
                    setIsLoading(false);
                    setStep(STEPS.OPTIONS);
                  }}
                  aria-label="Next"
                >
                  ✓
                </button>
              </div>

              {/* Tips Section */}
              <div className="tips-section">
                <h3 className="tips-title">Tips</h3>
                <ul className="tips-list">
                  <li>
                    If you do not have an exact budget, just enter an estimate!
                    The system will suggest meals beyond lower prices.
                  </li>
                  <li>
                    Try experimenting with different budgets, you may discover
                    new menu items.
                  </li>
                </ul>
              </div>

              {/* How-To Section */}
              <div className="howto-section">
                <h3
                  className="howto-title"
                  onClick={() => setBudgetHowToExpanded(!budgetHowToExpanded)}
                >
                  How-To
                  <svg
                    className={`howto-icon ${budgetHowToExpanded ? "expanded" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
                {budgetHowToExpanded && (
                  <div className="howto-content">
                    <div className="howto-subsection">
                      <p>
                        Enter your ideal budget for the week's meals. This will
                        be used by the system to suggest meals that fit in your
                        price range.
                      </p>
                      <p>
                        Click the "Enter Amount" box to type in a budget.
                        Alternatively, choose one of the presets using the
                        buttons.
                      </p>
                    </div>
                  </div>
                )}
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
                  ? "We're creating a meal plan that fits your schedule and budget."
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

              {currentDay.meals.length > 1 && (
                <div className="flow-row">
                  <span className="flow-label">
                    Meal {currentMealIndexInDay + 1} of{" "}
                    {currentDay.meals.length}
                  </span>
                </div>
              )}

              {getOptionsForDay(currentDayIndex).length === 0 ? (
                <p className="flow-subtitle">No meal options available for this day.</p>
              ) : (
                getOptionsForDay(currentDayIndex).map((item) => {
                  const selectedForDay = selectedByDay[currentDay.label] || [];
                  const isSelected =
                    selectedForDay[currentMealIndexInDay] === item.id;
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
                          const current = [...(prev[currentDay.label] || [])];
                          current[currentMealIndexInDay] = item.id;
                          return {
                            ...prev,
                            [currentDay.label]: current,
                          };
                        })
                      }
                    >
                      <div className="option-content">
                        <h3 className="option-title">{item.meal}</h3>
                        <p className="option-meta">
                          {item.restaurant} · ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}

              {/* Step Indicator */}
              <div className="step-indicator">
                <img src={progressBar3} alt="Step Indicator" />
              </div>

              <div className="flow-footer">
                <button
                  type="button"
                  className="flow-ghost-button"
                  onClick={() => {
                    setCurrentDayIndex(0);
                    setCurrentMealIndexInDay(0);
                    setStep(STEPS.BUDGET);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="flow-primary-button"
                  onClick={() => {
                    const selectedForDay =
                      selectedByDay[currentDay.label] || [];

                    // If no options exist for this day, skip it automatically
                    const dayHasOptions = getOptionsForDay(currentDayIndex).length > 0;
                    if (dayHasOptions && !selectedForDay[currentMealIndexInDay]) {
                      return; // Don't proceed if meal not selected
                    }

                    const mealsLeftInDay =
                      currentDay.meals.length - currentMealIndexInDay - 1;

                    if (mealsLeftInDay > 0) {
                      // Move to next meal in same day
                      setCurrentMealIndexInDay(currentMealIndexInDay + 1);
                    } else {
                      // Find next non-skipped day with options
                      let nextDayIndex = currentDayIndex + 1;
                      while (
                        nextDayIndex < days.length &&
                        (days[nextDayIndex].skipDay ||
                          getOptionsForDay(nextDayIndex).length === 0)
                      ) {
                        nextDayIndex++;
                      }

                      if (nextDayIndex < days.length) {
                        setCurrentDayIndex(nextDayIndex);
                        setCurrentMealIndexInDay(0);
                      } else {
                        setStep(STEPS.CONFIRM);
                      }
                    }
                  }}
                >
                  Next
                </button>
              </div>

              <div className="flow-howto">
                <h3
                  className="howto-title"
                  onClick={() => setOptionsHowToExpanded(!optionsHowToExpanded)}
                >
                  How-To
                  <svg
                    className={`howto-icon ${optionsHowToExpanded ? "expanded" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </h3>
                {optionsHowToExpanded && (
                  <div className="howto-content">
                    <div className="howto-subsection">
                      <p>
                        Choose your preferred meal for each meal block. You will
                        receive a notification at the time of the meal showing
                        your choice. If you notice any price discrepancies when
                        ordering, report menu updates using the Chat function.
                      </p>
                      <p>
                        <strong>Step 1:</strong> Select one of the suggested
                        meals for the time and date specified at the top. Tap on
                        a meal to select it. Use the filter button at the top
                        right to filter through your options.
                      </p>
                      <p>
                        <strong>Step 2:</strong> Repeat Step 1, until all meals
                        are filled out and press the confirm button.
                      </p>
                    </div>
                  </div>
                )}
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
                {days.map((day, i) => {
                  const selectedIds = selectedByDay[day.label] || [];
                  if (!selectedIds.length || day.skipDay) return null;

                  return (
                    <div key={day.label} className="plan-column">
                      <h3 className="plan-day">{day.label}</h3>
                      {day.meals.map((meal, mealIdx) => {
                        const selectedItemId = selectedIds[mealIdx];
                        const item = getOptionsForDay(i).find(
                          (opt) => opt.id === selectedItemId,
                        );

                        if (!item) return null;

                        const subtotal = parseFloat(item.price) || 0;
                        const tax = subtotal * 0.12;
                        const total = subtotal + tax;

                        const formatTime = (time24h) => {
                          if (!time24h) return "TBD";
                          const [hours, minutes] = time24h.split(":");
                          const hour = parseInt(hours, 10);
                          const ampm = hour >= 12 ? "PM" : "AM";
                          const hour12 = hour % 12 || 12;
                          return `${hour12}:${minutes}${ampm}`;
                        };

                        return (
                          <div key={item.id} className="plan-card">
                            <div className="plan-card-header">
                              <div className="plan-date-time">
                                {day.label} - {formatTime(meal.mealStartTime)}
                              </div>
                              {meal.mealDurationMinutes && (
                                <div className="plan-duration">
                                  {meal.mealDurationMinutes} min
                                </div>
                              )}
                            </div>
                            <div className="plan-restaurant">
                              {item.restaurant}
                            </div>
                            <div className="plan-meal-title">
                              {item.meal || item.name}
                            </div>
                            <div className="plan-pricing">
                              <div className="plan-price-row">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                              </div>
                              <div className="plan-price-row">
                                <span>Taxes:</span>
                                <span>${tax.toFixed(2)}</span>
                              </div>
                              <div className="plan-total">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Step Indicator */}
              <div className="step-indicator">
                <img src={progressBar4} alt="Step Indicator" />
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
                        JSON.stringify(payload),
                      );
                    } catch {
                      // ignore
                    }
                    navigate("/");
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