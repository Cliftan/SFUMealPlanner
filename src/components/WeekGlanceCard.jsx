// components/WeekGlanceCard.jsx
import { useNavigate } from "react-router-dom";

function getThisWeekMonday(today = new Date()) {
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

function getWeekDisplay() {
  const monday = getThisWeekMonday();
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return `${formatDayLabel(monday)} - ${formatDayLabel(friday)}`;
}

export default function WeekGlanceCard() {
  const navigate = useNavigate();

  return (
    <div className="section-card">
      <h2 className="section-title">Week at a Glance</h2>

      {/* Display current week dynamically */}
      <p className="card-text">
        You haven't planned your meals for <br />
        {getWeekDisplay()}
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