// components/BudgetCard.jsx
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sfu-meal-plan-week";

export default function BudgetCard() {
  const [budget, setBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    const loadBudgetData = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setBudget(0);
          setTotalSpend(0);
          return;
        }

        const parsed = JSON.parse(raw);
        setBudget(parsed.budget || 0);

        const { options = [], selectedByDay = {}, days = [] } = parsed;

        // options shape is [day][meal][item] — flatten 2 levels to get all items
        const allItems = options.flat(2);

        let spend = 0;
        days.forEach((day) => {
          const ids = selectedByDay[day.label] || [];
          ids.forEach((id) => {
            const match = allItems.find((opt) => opt.id === id);
            if (match) {
              const subtotal = match.price || 0;
              spend += subtotal * 1.12;
            }
          });
        });

        setTotalSpend(spend);
      } catch {
        // ignore
      }
    };

    loadBudgetData();

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadBudgetData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const budgetPercentage = useMemo(() => {
    if (budget === 0) return 0;
    return Math.min((totalSpend / budget) * 100, 100);
  }, [totalSpend, budget]);

  const isOverBudget = totalSpend > budget;
  const remainingBudget = Math.max(0, budget - totalSpend);

  return (
    <div className="section-card">
      <h2 className="section-title">Budget</h2>
      {budget > 0 ? (
        <>
          <div className="budget-bar-container">
            <div
              className={`budget-bar ${isOverBudget ? "over-budget" : ""}`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="budget-info">
            <div className="budget-spend">
              <span className="budget-label">Spent:</span>
              <span className="budget-amount">${totalSpend.toFixed(2)}</span>
            </div>
            <div className="budget-remaining">
              <span className="budget-label">
                {isOverBudget ? "Over Budget:" : "Remaining:"}
              </span>
              <span
                className={`budget-amount ${isOverBudget ? "over-budget-text" : ""}`}
              >
                ${Math.abs(remainingBudget).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="card-text budget-status">
            {isOverBudget
              ? `You're over budget by $${(totalSpend - budget).toFixed(2)}`
              : `$${remainingBudget.toFixed(2)} left to spend this week`}
          </p>
        </>
      ) : (
        <p className="card-text">
          Create a schedule to set your budget for the week!
        </p>
      )}
    </div>
  );
}