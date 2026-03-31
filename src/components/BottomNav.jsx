import { useNavigate } from "react-router-dom";
import homeIcon from "../Resources/Icons/home.png";
import scheduleIcon from "../Resources/Icons/schedule.png";
import analyticsIcon from "../Resources/Icons/analytics.png";
import restaurantsIcon from "../Resources/Icons/restaurants.png";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">

      <button onClick={() => navigate("/")}>
        <img src={homeIcon} alt="Home" />
        <span>Home</span>
      </button>

      <button onClick={() => navigate("/schedule")}>
        <img src={scheduleIcon} alt="Schedule" />
        <span>Schedule</span>
      </button>

      <button disabled>
        <img src={analyticsIcon} alt="Analytics" />
        <span>Analytics</span>
      </button>

      <button disabled>
        <img src={restaurantsIcon} alt="Restaurants" />
        <span>Restaurants</span>
      </button>

    </div>
  );
}