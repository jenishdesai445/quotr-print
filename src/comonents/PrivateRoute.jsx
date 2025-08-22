import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  let token = localStorage.getItem("quotrUserToken");

  if (!token) {
    return <Navigate to="/log-in" />;
  }

  if (!token) {
    return <Navigate to="/sign-up" />;
  }
  return <>{children}</>;
};
