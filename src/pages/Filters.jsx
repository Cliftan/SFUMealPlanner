import { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

function PreferenceEditor({ label, initial }) {
  const [items, setItems] = useState(initial);
  const [input, setInput] = useState("");

  return (
    <div className="filters-group">
      <h3 className="filters-label">{label}</h3>
      <div className="filters-pill-row">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="filters-pill filters-pill-removable"
            onClick={() =>
              setItems((prev) => prev.filter((current) => current !== item))
            }
          >
            {item} <span className="filters-pill-x">✕</span>
          </button>
        ))}
      </div>
      <form
        className="filters-add-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || items.includes(input.trim())) return;
          setItems((prev) => [...prev, input.trim()]);
          setInput("");
        }}
      >
        <input
          className="flow-text-input"
          placeholder={`Add ${label.toLowerCase()}…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

export default function Filters() {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          <div className="section-card">
            <h2 className="section-title">Settings</h2>

            <PreferenceEditor
              label="Diet Restrictions"
              initial={["None", "Halal", "Vegan", "Gluten-Free"]}
            />

            <PreferenceEditor
              label="Preferred"
              initial={["Burger", "Asian", "Cafe"]}
            />

            <PreferenceEditor
              label="Avoid"
              initial={["Spicy", "Seafood"]}
            />

            <div className="filters-group">
              <h3 className="filters-label">Privacy</h3>
              <div className="filters-card" />
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

