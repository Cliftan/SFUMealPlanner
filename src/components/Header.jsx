import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-left">
        <span className="header-icon">🍽</span>
        <span className="header-title">SFU Meal Planner</span>
      </div>
      <div className="header-icons">
        <button
          className="header-button"
          type="button"
          onClick={() => navigate("/filters")}
        >
          ⚙
        </button>
        <button
          className="header-button"
          type="button"
          onClick={() => navigate("/help")}
        >
          ❓
        </button>
      </div>
    </div>
  );
}