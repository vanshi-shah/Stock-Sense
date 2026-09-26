import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Warehouse from "./pages/Warehouse";
import Locations from "./pages/Locations";
import { ComponentGallery } from "./pages/ComponentGallery";
import Landing from "./pages/Landing";
import MoveHistory from "./pages/MoveHistory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import UpdatePassword from "./pages/UpdatePassword";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* Protected routes — require an active session */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/products"
          element={
            <DashboardLayout>
              <Stock />
            </DashboardLayout>
          }
        />
        <Route
          path="/warehouse"
          element={
            <DashboardLayout>
              <Warehouse />
            </DashboardLayout>
          }
        />
        <Route
          path="/locations"
          element={
            <DashboardLayout>
              <Locations />
            </DashboardLayout>
          }
        />
        <Route
          path="/components"
          element={
            <DashboardLayout>
              <ComponentGallery />
            </DashboardLayout>
          }
        />
        <Route
          path="/move-history"
          element={
            <DashboardLayout>
              <MoveHistory />
            </DashboardLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
