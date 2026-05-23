import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const handledRef = useRef(false);
  const [message, setMessage] = useState("Đang hoàn tất đăng nhập...");

  const { login } = useAuth();

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;

    const rawParams = window.location.hash
      ? window.location.hash.slice(1)
      : window.location.search.replace(/^\?/, "");
    const params = new URLSearchParams(rawParams);
    const token = params.get("access_token");
    const owner = params.get("owner");
    const error = params.get("error");

    if (error || !token) {
      setMessage("Đăng nhập Google thất bại. Vui lòng thử lại.");
      return;
    }

    login(token);
    if (owner) {
      localStorage.setItem("owner", owner);
    }

    navigate("/", { replace: true });
  }, [navigate, login]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-margin-mobile font-body-md">
      <p className="text-body-md text-on-surface-variant">{message}</p>
    </div>
  );
};

export default AuthCallback;
