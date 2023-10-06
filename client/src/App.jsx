import {
  useState,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/user/Dashboard/Dashboard";
import DocProfile from "./pages/user/Doctor/Doctor";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/" element={<Dashboard />} />
          <Route path="/user/doctor/:id" element={<DocProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
