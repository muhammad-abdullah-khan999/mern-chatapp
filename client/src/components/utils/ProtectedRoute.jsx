import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, screenLoading } = useSelector(
    (state) => {
      console.log("state.userReducer: ", state.userReducer)
      return state.userReducer
    }
  );
  console.log("is Authenticated: ",isAuthenticated)
  const navigate = useNavigate();

  useEffect(() => {
    if (!screenLoading && !isAuthenticated) navigate('/login')
  }, [isAuthenticated, screenLoading]);

  return children;
};

export default ProtectedRoute;