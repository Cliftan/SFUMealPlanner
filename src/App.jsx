import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import Restaurants from "./pages/Restaurants";
import Filters from "./pages/Filters";
import Help from "./pages/Help";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/filters" element={<Filters />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;