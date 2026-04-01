import { useNavigate } from "react-router-dom";
import logoIcon from "../Resources/Icons/logo.png";
import settingsIcon from "../Resources/Icons/settings.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-left">
        <img src={logoIcon} alt="Logo" className="header-icon" />
        <span className="header-title">SFU MealMap</span>
      </div>
      <div className="header-icons">
        <button
          className="header-button"
          type="button"
          onClick={() => navigate("/filters")}
        >
          <img src={settingsIcon} alt="Settings" />
        </button>
      </div>
    </div>
  );
}