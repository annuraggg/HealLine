
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/user/Dashboard/Dashboard";
import DocProfile from "./pages/user/Doctor/Doctor";
import Appointment from "./pages/user/Appointments/Appointments";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/" element={<Dashboard />} />
          <Route path="/user/doctor/:id" element={<DocProfile />} />
          <Route path="/user/appointments" element={<Appointment />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
