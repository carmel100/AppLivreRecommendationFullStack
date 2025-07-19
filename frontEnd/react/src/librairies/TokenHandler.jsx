import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/Accueil", { replace: true });
    }
  }, [location, navigate]);

  return null; // Ce composant n'affiche rien
};

export default TokenHandler;
