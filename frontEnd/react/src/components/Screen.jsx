
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Main from "./Main";
import store from "../librairies/zustand";
//import PageWrapper from "./PageWrapper";
import API_URL from "../librairies/config";
const Screen = () => {

 

  const navigate = useNavigate();
  const setUser = store((state) => state.setUser);


  useEffect(() => {
    // Récupération du token dans l'URL (ex: après login Google)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      // Stocker le token dans localStorage
      localStorage.setItem("token", tokenFromUrl);

      try {
        // Décoder le token JWT pour récupérer les données utilisateur
        const decoded = jwtDecode(tokenFromUrl);

        // Debug : affiche tout le contenu du token décodé
        console.log("Token décodé :", decoded);

        // Mettre à jour l'état global utilisateur
        setUser({
          prenom: decoded.prenom || "",
          nom: decoded.nom || "",
          email: decoded.email || "",
        });

        // Nettoyer l'URL pour ne plus exposer le token (optionnel)
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Erreur décodage token :", error);
        // Si token invalide, on nettoie localStorage et redirige
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
    } else {
      // Si pas de token dans l'URL, on récupère celui du localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser({
          prenom: decoded.prenom || "",
          nom: decoded.nom || "",
          email: decoded.email || "",
        });
      } catch {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
    }

    // Vérification backend que le token est toujours valide
    const tokenToUse = tokenFromUrl || localStorage.getItem("token");
    fetch(`${API_URL}/protected`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        console.log(data.message); // Ex: "Bienvenue email"
      })
      .catch((err) => {
        console.error("Token invalide ou expiré :", err);
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
      });
  }, [navigate, setUser]);

     
 const refreshKey = store((state) => state.refreshKey);

  useEffect(() => {
    console.log('Rechargement déclenché par refreshKey', refreshKey);
    // Ici tu peux relancer une animation, un fetch, etc.
  }, [refreshKey])

  return (
    <>

 

<Header />
 <Main />





      
    </>
  );
};

export default Screen;
