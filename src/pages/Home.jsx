// pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BudgetCard from "../components/BudgetCard";
import PromotionCard from "../components/PromotionCard";
import BottomNav from "../components/BottomNav";
import breakfastImage from "../Resources/Images/breakfast.jpg";
import bubbleteaImage from "../Resources/Images/bubbletea.jpg";
import chatIcon from "../Resources/Icons/chat.png";

const STORAGE_KEY = "sfu-meal-plan-week";

const promotions = [
  {
    title: "Free Breakfast!",
    location: "Simon Fraser Student Society",
    description: "Come visit us at the SFU SUB for free breakfast!",
    image: breakfastImage,
  },
  {
    title: "BOGO Milk Tea 50% Off",
    location: "Bien Gong's Tea",
    description: "Buy one get one 50% off all Milk Tea every weekdays from 2-5pm!",
    image: bubbleteaImage,
  },
];

function PlannedWeekCard({ plan }) {
  const { days = [], selectedByDay = {}, options = [] } = plan;

  // options is an array of arrays (one per day) — flatten before searching
  const allItems = options.flat();

  const formatPrice = (price) => Number(price).toFixed(2);

  const formatTime = (time24h) => {
    if (!time24h) return "TBD";
    const [hours, minutes] = time24h.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}${ampm}`;
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Week at a Glance</h2>
      <div className="plan-grid">
        {days.map((day) => {
          const ids = selectedByDay[day.label] || [];
          if (!ids.length || day.skipDay) return null;

          return (
            <div key={day.label} className="plan-column">
              {day.meals.map((meal, mealIdx) => {
                const selectedItemId = ids[mealIdx];
                const item = allItems.find((opt) => opt.id === selectedItemId);

                if (!item) return null;

                const subtotal = item.price;
                const tax = subtotal * 0.12;
                const total = subtotal + tax;

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
                    <div className="plan-restaurant">{item.restaurant}</div>
                    <div className="plan-meal-title">{item.meal || item.name}</div>
                    <div className="plan-pricing">
                      <div className="plan-price-row">
                        <span>Subtotal:</span>
                        <span>${formatPrice(subtotal)}</span>
                      </div>
                      <div className="plan-price-row">
                        <span>Tax:</span>
                        <span>${formatPrice(tax)}</span>
                      </div>
                      <div className="plan-price-row plan-total">
                        <span>Total:</span>
                        <span>${formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [weekPlan, setWeekPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setWeekPlan(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          {weekPlan ? (
            <PlannedWeekCard plan={weekPlan} />
          ) : (
            <div className="section-card">
              <h2 className="section-title">Plan Your Meals</h2>
              <p className="card-text">
                You haven't planned your meals for the week yet.
              </p>
              <button
                className="section-button"
                type="button"
                onClick={() => navigate("/schedule")}
              >
                Create Schedule
              </button>
            </div>
          )}

          <BudgetCard />

          <div className="promotions-section">
            <h2 className="section-title">Promotions</h2>
            <div className="promotions-list">
              {promotions.map((promo, index) => (
                <PromotionCard key={index} {...promo} />
              ))}
            </div>
          </div>
        </div>

        <BottomNav />

        {/* Floating Action Button */}
        <button
          className="chat-fab"
          onClick={() => navigate("/chat")}
          aria-label="Open Chat"
        >
          <img src={chatIcon} alt="Chat" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}