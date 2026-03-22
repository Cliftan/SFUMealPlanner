import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">

      <button onClick={() => navigate("/")}>
        🏠
        <span>Home</span>
      </button>

      <button onClick={() => navigate("/schedule")}>
        📅
        <span>Schedule</span>
      </button>

      <button onClick={() => navigate("/analytics")}>
        📊
        <span>Analytics</span>
      </button>

      <button onClick={() => navigate("/restaurants")}>
        🍽
        <span>Restaurants</span>
      </button>

    </div>
  );
}