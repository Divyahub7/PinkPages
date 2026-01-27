import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login");
    }

    if (!authentication && authStatus) {
      navigate("/");
    }
  }, [authStatus, authentication, navigate]);

  return <>{children}</>;
}
