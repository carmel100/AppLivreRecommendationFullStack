import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../librairies/config";
import store from "../librairies/zustand";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const changetheme = store((state) => state.changetheme);


  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nouveauMotDePasse: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Mot de passe mis à jour !");
        setTimeout(() => {
          navigate("/"); // redirige vers la page de connexion après 3 secondes
        }, 3000);
      } else {
        setMessage(data.message || "❌ Une erreur est survenue.");
      }
    } catch (error) {
      setMessage("❌ Erreur serveur. Veuillez réessayer.",error);
    }
  };

  return (
    <>
       <div  className={` ${changetheme ? `bg-[#000000d1] text-white` : ``} h-[100vh]`}>
         <form onSubmit={handleReset} className="p-4 max-w-md mx-auto mt-20">
      <h2 className="text-xl mb-4 font-bold">Nouveau mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-4 rounded"
        required
      />
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Réinitialiser
      </button>
      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </form>
       </div>
     
    </>
  
  );
};

export default ResetPassword;
