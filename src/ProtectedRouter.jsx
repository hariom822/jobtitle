import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar allowedRoles diya hai to role check karo
  if (allowedRoles && !allowedRoles.includes(role)) {

    if (role === "candidate" || role === "employee") {
      return <Navigate to="/sidebarprofile/candidatejobs" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/" replace />;
    }

    if (role === "companie") {
      return <Navigate to="/company/jobs" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}