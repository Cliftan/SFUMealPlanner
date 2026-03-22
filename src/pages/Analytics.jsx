// pages/Analytics.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const STORAGE_KEY = "sfu-meal-plan-week";

export default function Analytics() {
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setBudget(parsed.budget || 0);

      const selectedItems = [];
      const { options = [], selectedByDay = {} } = parsed;

      Object.keys(selectedByDay).forEach((dayLabel) => {
        const ids = selectedByDay[dayLabel] || [];
        ids.forEach((id) => {
          const match = options.find((opt) => opt.id === id);
          if (match) {
            selectedItems.push({ ...match, dayLabel });
          }
        });
      });
      setItems(selectedItems);
    } catch {
      // ignore
    }
  }, []);

  const totalSpend = useMemo(
    () => items.reduce((sum, i) => sum + (i.price || 0), 0),
    [items]
  );

  const totalMeals = items.length;

  const byRestaurant = useMemo(() => {
    const counts = {};
    items.forEach((i) => {
      if (!i.restaurant) return;
      counts[i.restaurant] = (counts[i.restaurant] || 0) + 1;
    });
    return counts;
  }, [items]);

  const topRestaurant =
    Object.entries(byRestaurant).sort((a, b) => b[1] - a[1])[0] || null;

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          <div className="section-card">
            <h2 className="section-title">Analytics</h2>
            <p className="card-text">
              Learn about your spending and where you eat most.
            </p>

            <div className="analytics-row">
              <div className="analytics-circle-block">
                <div className="analytics-circle">
                  <div className="analytics-circle-inner" />
                </div>
                <p className="analytics-label">Weekly Spend</p>
                <p className="analytics-helper">
                  Planned about{" "}
                  <strong>${totalSpend.toFixed(2)}</strong> this week across{" "}
                  {totalMeals} meal{totalMeals === 1 ? "" : "s"} (budget{" "}
                  <strong>${budget.toFixed(2)}</strong>).
                </p>
              </div>

              <div className="analytics-circle-block">
                <div className="analytics-circle">
                  <div className="analytics-circle-inner" />
                </div>
                <p className="analytics-label">Favourite Spots</p>
                <p className="analytics-helper">
                  {topRestaurant ? (
                    <>
                      You visit <strong>{topRestaurant[0]}</strong> the most (
                      {topRestaurant[1]} time
                      {topRestaurant[1] === 1 ? "" : "s"} this plan).
                    </>
                  ) : (
                    "Plan some meals to see restaurant stats."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}