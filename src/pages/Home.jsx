// pages/Home.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import WeekGlanceCard from "../components/WeekGlanceCard";
import BudgetCard from "../components/BudgetCard";
import PromotionCard from "../components/PromotionCard";
import BottomNav from "../components/BottomNav";

const STORAGE_KEY = "sfu-meal-plan-week";

const promotions = [
  {
    title: "Free Breakfast!",
    location: "Simon Fraser Student Society",
    description: "Come visit us at the SFU SUB for free breakfast!"
  },
  {
    title: "BOGO Milk Tea 50% Off",
    location: "Bien Gong's Tea",
    description: "Buy one get one 50% off all Milk Tea every weekdays from 2-5pm!"
  },
  {
    title: "20% Off Coupon",
    location: "Restaurants in the SUB",
    description: "All restaurants participating - come visit us on March 6th!"
  }
];

function PlannedWeekCard({ plan }) {
  const { days = [], selectedByDay = {}, options = [] } = plan;

  return (
    <div className="section-card">
      <h2 className="section-title">Week at a Glance</h2>
      {days.map((day) => {
        const ids = selectedByDay[day.label] || [];
        if (!ids.length) return null;
        const items = options.filter((opt) => ids.includes(opt.id));
        return (
          <div key={day.label} className="plan-day-block">
            <h3 className="plan-day">{day.label}</h3>
            {items.map((item) => (
              <div key={item.id} className="plan-card">
                <div className="plan-row">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
                <div className="plan-row">
                  <span>{item.restaurant}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [weekPlan, setWeekPlan] = useState(null);

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
          {weekPlan ? <PlannedWeekCard plan={weekPlan} /> : <WeekGlanceCard />}

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
      </div>
    </div>
  );
}