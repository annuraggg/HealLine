
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/user/Dashboard/Dashboard";
import DocProfile from "./pages/user/Doctor/Doctor";
import Appointment from "./pages/user/Appointments/Appointments";
import DoctorProfile from "./pages/Doctor/Doctor";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/" element={<Dashboard />} />
          <Route path="/user/doctor/:id" element={<DocProfile />} />
          <Route path="/user/appointments" element={<Appointment />} />
          <Route path="/doctor" element={<DoctorProfile/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
