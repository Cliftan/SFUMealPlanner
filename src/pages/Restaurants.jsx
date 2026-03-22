// pages/Restaurants.jsx
import { useMemo, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import menu from "../data/menu.json";

export default function Restaurants() {
  const [query, setQuery] = useState("");

  const allRestaurants = useMemo(() => {
    const campus = menu.campuses[0];
    return campus.restaurants.map((r) => ({
      name: r.name,
      campus: campus.name,
      price: "$$",
      category: r.category,
    }));
  }, []);

  const filtered = allRestaurants.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.campus.toLowerCase().includes(q)
    );
  });
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          <div className="section-card">
            <h2 className="section-title">Restaurants</h2>
            <p className="flow-subtitle">
              Search restaurants on campus.
            </p>

            <div className="flow-field">
              <input
                type="text"
                className="flow-text-input"
                placeholder="Search by name, campus, or cuisine…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="restaurant-list">
              {filtered.map((r) => (
                <div key={r.name} className="restaurant-card">
                  <div className="restaurant-image" />
                  <div className="restaurant-content">
                    <h3 className="restaurant-title">{r.name}</h3>
                    <p className="restaurant-meta">
                      {r.campus} · {r.category}
                    </p>
                  </div>
                  <div className="restaurant-price">{r.price}</div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="analytics-helper">
                  No restaurants match your search yet.
                </p>
              )}
            </div>
          </div>

          <div className="section-card">
            <h2 className="section-title">Featured</h2>
            <p className="flow-subtitle">Featured restaurants here.</p>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}