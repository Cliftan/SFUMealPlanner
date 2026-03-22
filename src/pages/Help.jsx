import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function Help() {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          <div className="section-card">
            <h2 className="section-title">How SFU Meal Planner Works</h2>
            <p className="flow-howto-text">
              This app helps you plan budget‑friendly meals on campus based on
              your weekly schedule, spending goals, and food preferences.
            </p>
          </div>

          <div className="section-card">
            <h2 className="section-title">Tabs</h2>
            <ul className="help-list">
              <li>
                <strong>Home</strong>: Overview of your week, budget, and
                active promotions on campus.
              </li>
              <li>
                <strong>Schedule</strong>: Enter when you&apos;re on campus and
                your weekly budget. The planner will generate meal options that
                fit your time windows.
              </li>
              <li>
                <strong>Analytics</strong>: See how much you&apos;re spending
                and which restaurants you visit the most.
              </li>
              <li>
                <strong>Restaurants</strong>: Search restaurants on campus and
                explore where to eat.
              </li>
              <li>
                <strong>Chat</strong>: Talk with the AI to adjust preferences
                such as calories, allergies, and cuisines.
              </li>
              <li>
                <strong>Settings</strong>: Manage diet restrictions, preferred
                foods, and foods to avoid.
              </li>
            </ul>
          </div>

          <div className="section-card">
            <h2 className="section-title">Tips</h2>
            <ul className="help-list">
              <li>
                Start in <strong>Schedule</strong> and fill in at least one day
                so Analytics has something to show.
              </li>
              <li>
                Use <strong>Chat</strong> and <strong>Settings</strong> to
                share allergies or strong dislikes so they can be factored into
                the plan.
              </li>
              <li>
                Re‑run the planner whenever your schedule or budget changes.
              </li>
            </ul>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

