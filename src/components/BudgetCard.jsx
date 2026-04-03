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

        // Calculate total spend from selected items
        const selectedItems = [];
        const { options = [], selectedByDay = {} } = parsed;

        Object.keys(selectedByDay).forEach((dayLabel) => {
          const ids = selectedByDay[dayLabel] || [];
          ids.forEach((id) => {
            const match = options.find((opt) => opt.id === id);
            if (match) {
              selectedItems.push(match);
            }
          });
        });

        const spend = selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalSpend(spend);
      } catch {
        // ignore
      }
    };

    // Load data initially
    loadBudgetData();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadBudgetData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
              className={`budget-bar ${isOverBudget ? 'over-budget' : ''}`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>

          <div className="budget-info">
            <div className="budget-spend">
              <span className="budget-label">Spent:</span>
              <span className="budget-amount">${(totalSpend * 1.12).toFixed(2)}</span>
            </div>
            <div className="budget-remaining">
              <span className="budget-label">
                {isOverBudget ? 'Over Budget:' : 'Remaining:'}
              </span>
              <span className={`budget-amount ${isOverBudget ? 'over-budget-text' : ''}`}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </span>
            </div>
          </div>

          <p className="card-text budget-status">
            {isOverBudget
              ? `You're over budget by $${(totalSpend - budget).toFixed(2)}`
              : `$${remainingBudget.toFixed(2)} left to spend this week`
            }
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