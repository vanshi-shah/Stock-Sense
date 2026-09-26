import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { ComponentGallery } from "./pages/ComponentGallery";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
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
    </Routes>
  );
}

export default App;
