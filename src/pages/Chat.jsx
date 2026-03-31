// pages/Chat.jsx
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function Chat() {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header />

        <div className="content">
          {/* Chat content will go here */}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}