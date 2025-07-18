import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import store from "../librairies/zustand";


const BigViewRecommendation = () => {
  const { id } = useParams();
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

    const changetheme = store((state) => state.changetheme);


  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded._id || decoded.id;
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
    }
  }

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
         const res = await fetch(`http://localhost:3000/recommendation/bigview/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setRec(data);
      } catch (err) {
        console.error("Erreur fetch recommandation:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchRecommendation();
  }, [id, token]);


  if (loading) return <p className="p-4">Chargement...</p>;
  if (!rec) return <p className="p-4">Recommandation introuvable.</p>;

  return (

    <>
           <Header disabled={true}  />
 
 
  <div className={`min-h-screen pt-40 flex justify-center px-6 py-10 ${changetheme ? "bg-[#000000d1] text-white" : ""}`}>

        <div className={`max-w-3xl ${changetheme ? "bg-[#000000d1] text-white shadow-[0px_0px_1px_1px_#00ced15c]" : "bg-[#f5f5f587] shadow-[0px_0px_6px_0px_#00000038]"} rounded-[8px] p-4 `}>

      <h2 className="text-2xl font-bold mb-2">{rec.Titre}</h2>

      {rec.Image && (
        <img
          src={rec.Image}
          alt={rec.Titre}
          className="w-full  max-ls:h-[350px]  ls:h-[500px] ns:h-[700px] mb-4 rounded"
        />
      )}

      <p className="mb-2"><strong>Auteur :</strong> {rec.Auteur}</p>
      <p className="mb-4 whitespace-pre-line">
            <strong>Description :</strong> {rec.Description?.replace(/<[^>]+>/g, "")}
        </p>
        
       
      <div className="flex justify-between items-center mb-4"> 
        <div className="flex gap-4">

             <button  className="flex items-center gap-1">
       <BiSolidLike className="text-[30px] text-green-600"   />

          <span>{rec.likes?.length || 0}</span>
        </button>

        <button  className="flex items-center gap-1">
            <BiSolidDislike className="text-[30px] text-red-600" />
          <span>{rec.dislikes?.length || 0}</span>
        </button>

        </div>
       

      <div className="flex items-center gap-2  py-2 px-3 rounded   bg-amber-500">
          {rec.abonnés?.length > 1 ? "Abonnés" : " Abonné"} ({rec.abonnés?.length || 0})
          </div>
      </div>

      {rec.commentaires && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-2">Commentaires</h3>
    {rec.commentaires.length > 0 ? (
      <ul className="space-y-3">
        {rec.commentaires.map((com, index) => (
          <li key={index} >
            <div className="grid rounded-[8px] p-2 bg-[#0ee77a]">
                <p className=" ">
             {com.contenu}
               </p>
                <div  className="flex text-sm  text-gray-500  items-center gap-2 mt-1">
           Posté par <p> {com.auteur?.prenom || "Utilisateur"} le {new Date(com.date).toLocaleString()} </p> 
            
                </div>
               


            </div>
           
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500">Aucun commentaire pour cette recommandation.</p>
    )}
  </div>
)}

   
    </div>
           </div>

    
    </>
  );
};

export default BigViewRecommendation;
