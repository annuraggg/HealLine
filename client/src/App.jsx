import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/user/Dashboard/Dashboard";
import DocProfile from "./pages/user/Doctor/Doctor";
import Appointment from "./pages/user/Appointments/Appointments";
import DoctorProfile from "./pages/Doctor/Doctor";
import "./App.css";
import Home from "./pages/home/Home";

import DoctorAppointment from "./pages/Doctor/Appointments";
import Profile from "./components/doctor/Profile"
import Push from "push.js";
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/" element={<Dashboard />} />
          <Route path="/user/doctor/:id" element={<DocProfile />} />
          <Route path="/user/appointments" element={<Appointment />} />


          <Route path="/doctor" element={<DoctorProfile />} />
          <Route path="doctor/appointments" element={<DoctorAppointment />} />
          <Route path="/settings" element={<Profile/>} />

          <Route path="/" element={<Auth/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
