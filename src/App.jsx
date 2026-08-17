import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Core Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ServiceForm from "./pages/ServiceForm";

// Authentication Flow
import Login from "./pages/Login";
import Register from "./pages/Register";
import PhoneVerification from "./pages/PhoneVerification";
import AgentOnboarding from "./pages/AgentOnboarding";

// Role-Based Dashboards
import UserDashboard from "./pages/UserDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// User Features
import HelpSupport from "./pages/HelpSupport";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <Router>
      {/* Global Navigation */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/service-form/:name" element={<ServiceForm />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-phone" element={<PhoneVerification />} />
        <Route path="/agent-onboarding" element={<AgentOnboarding />} />
        
        {/* Role-Specific Dashboard Routes */}
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/agent" element={<AgentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* Global Feature Routes */}
        <Route path="/support" element={<HelpSupport />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}