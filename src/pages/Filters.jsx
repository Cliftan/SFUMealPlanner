import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

function PreferenceEditor({ label, storageKey, initial }) {
  const [items, setItems] = useState(() => {
    // Load from localStorage on initial render
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : initial;
  });
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const handleRemoveItem = (item) => {
    setItems((prev) => prev.filter((current) => current !== item));
  };

  const handleCustomClick = () => {
    navigate("/chat");
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!input.trim() || items.includes(input.trim())) return;
    setItems((prev) => [...prev, input.trim()]);
    setInput("");
  };

  return (
    <div className="filter-card">
      <h3 className="filter-section-title">{label}</h3>
      <div className="filter-pills-container">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={item === "+ Custom" ? "filter-pill custom-button" : "filter-pill"}
            onClick={
              item === "+ Custom"
                ? handleCustomClick
                : () => handleRemoveItem(item)
            }
          >
            {item}
            {item !== "+ Custom" && <span className="filter-pill-x">✕</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filters() {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />
        <div className="content">
          <div className="settings-header">
            <h2 className="settings-title">Settings</h2>
            <p className="settings-subtitle">
              Preferences can also be added using the Chat tab.
            </p>
          </div>
          <PreferenceEditor
            label="Diet Restrictions"
            storageKey="dietRestrictions"
            initial={["Dairy", "Eggs", "Fish", "Nuts", "Gluten", "+ Custom"]}
          />
          <PreferenceEditor
            label="Preferred"
            storageKey="preferred"
            initial={["Fast Food", "+ Custom"]}
          />
          <PreferenceEditor
            label="Avoid"
            storageKey="avoid"
            initial={["Salad", "+ Custom"]}
          />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}