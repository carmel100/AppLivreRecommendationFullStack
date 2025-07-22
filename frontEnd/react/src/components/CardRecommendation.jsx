
import { useEffect, useState } from "react";
import Header from "./Header";
import CardItemRecommendation from "./CardItemRecommendation";
import store from "../librairies/zustand";
import { CgDanger } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import API_URL from "../librairies/config";
import SkeletonPost1 from "./SkeletonPost1";

const CardRecommendation = () => {

  const navigate = useNavigate()

  const handleClick = () =>{
    navigate('/AddRecommendation')
  }
   
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const setLoading1 = store((state) => state.setLoading1);
  const loading1 = store((state) => state.loading1);


  useEffect(() => {

    setLoading1(true);


    const fetchRecommendations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          console.error("Erreur lors du décodage du token :", e);
          return null;
        }
      };

      const decoded = parseJwt(token);
      const userId = decoded?.id;

      if (!userId) return;

      const res = await fetch(`${API_URL}/users/${userId}/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRecommendations(data);
      setLoading(false)
    };

    fetchRecommendations();

    setTimeout(() => {
      setLoading1(false);
    }, 3000);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publierRecommandation = async (id) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}/books/publish/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) alert("✅ Livre publié !");
    else alert("❌ Erreur : " + data.message);
  };

  const supprimerRecommendation = async (id) => {
  const token = localStorage.getItem("token");

  const confirm = window.confirm("Voulez-vous vraiment supprimer cette recommandation ?");
  if (!confirm) return;
console.log("ID à supprimer :", id);

    const res = await fetch(`${API_URL}/books/recommendation/${id}`, {
  method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Recommandation supprimée !");
    setRecommendations((prev) => prev.filter((r) => r._id !== id));
  } else {
    alert("❌ Erreur : " + data.message);
  }
  
};


    const changetheme = store((state) => state.changetheme);

 const navigate1 = useNavigate();
       
           
  return (
    <>
      <Header disabled={true}  />
       {!loading && recommendations.length === 0 && (
  <div className={`h-[100vh] relative z-0 ${changetheme ? 'bg-[#000000d1] text-white' : ''}`}>
    <div className="grid vss:justify-center justify-items-center pt-28">
      <div className="flex pb-1.5 max-hs:gap-x-2 hs:gap-x-[50px] justify-center items-center">
        <CgDanger className="max-vss:text-[30px] max-hs:text-[50px] hs:text-[70px] text-red-600 mt-4" />
        <p className="max-vss:text-[20px] max-hs:text-[30px] hs:text-[50px] mt-3">Aucune recommendation</p>
      </div>
      <button
        onClick={handleClick}
        className="bg-blue-600 max-w-fit px-4 py-3 rounded-[5px] duration-300 hover:text-blue-600 hover:shadow-[0px_0px_7px_0px] hover:bg-transparent text-white justify-center items-center mt-4"
      >
        Ajouter une recommendation
      </button>
    </div>
  </div>
) 
}
      <div className={`flex min-h-screen ${changetheme ?  `bg-[#000000d1] text-white` : ``}  ${recommendations.length !== 0 ? `` : `hidden`}  flex-wrap px-12 pt-28 gap-x-16 gap-y-10 justify-center p-4`}>

        { 
        
        recommendations.map((rec) =>  loading1 ? ( <SkeletonPost1/> ) :  (
         <CardItemRecommendation
            id={rec._id}
           key={rec._id} 
            Titre={rec.Titre.split(" ").slice(0, 5).join(" ") + '…'}
            Auteur={rec.Auteur}
            Description={rec.Description ? rec.Description.replace(/<[^>]+>/g, '').split(' ').slice(0, 4).join(' ') + '…': ''}  
            Image={rec.Image}
            Notes={rec.Notes}
            Pointe={() => publierRecommandation(rec._id)}
            likesCount={rec.likesCount}
            dislikesCount={rec.dislikesCount}
            abonnementsCount={rec.abonnementsCount}
            handleClick1={() => navigate1(`/BigViewRecommendation/${rec._id}`)}
            suppimerRecommendation={() => supprimerRecommendation(rec._id)}
          />

               
        ))   } 
      </div>
    </>
  );
};

export default CardRecommendation;