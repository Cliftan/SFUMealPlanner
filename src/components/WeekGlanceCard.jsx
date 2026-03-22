// components/WeekGlanceCard.jsx
import { useNavigate } from "react-router-dom";

export default function WeekGlanceCard() {
  const navigate = useNavigate();

  return (
    <div className="section-card">
      <h2 className="section-title">Week at a Glance</h2>

      <p className="card-text">
        You haven't planned your meals for <br />
        March 9 - March 13
      </p>

      <button
        className="section-button"
        type="button"
        onClick={() => navigate("/schedule")}
      >
        Create Schedule
      </button>
    </div>
  );
}