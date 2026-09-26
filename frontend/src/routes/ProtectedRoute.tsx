import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Wraps routes that require an authenticated session.
 * Shows a spinner while the session is being resolved, then
 * redirects to /login if there's no session.
 */
export function ProtectedRoute() {
  const { session, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
