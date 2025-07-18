import { useState, useEffect } from 'react';
import Header from './Header';
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import store from '../librairies/zustand';
import { jwtDecode } from 'jwt-decode';
import PageWrapper from './PageWrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsFillPlusCircleFill } from "react-icons/bs";
import API_URL from '../librairies/config';
const Interraction = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const changetheme = store((state) => state.changetheme);

  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded._id || decoded.id; // dépend de ta structure de token
    } catch (e) {
      console.error("Erreur lors du décodage du token :", e);
    }
  }

  useEffect(() => {
    if (!token) {
      setError("Tu dois être connecté pour voir les recommandations.");
      return;
    }

    fetch(`${API_URL}/test/interractions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Erreur serveur");
          return;
        }

        setRecommendations(data);
        setError(null);
      })
      .catch((err) => {
        setError("Erreur réseau");
        console.error(err);
      });
  }, [token]);

  const handleLike = async (id) => {
    const res = await fetch(`${API_URL}/books/${id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setRecommendations(prev =>
        prev.map(rec => rec._id === id ? { ...rec, likes: data.likes } : rec)
      );
    }
  };

  const handleDislike = async (id) => {
    const res = await fetch(`${API_URL}/books/${id}/dislike`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setRecommendations(prev =>
        prev.map(rec => rec._id === id ? { ...rec, dislikes: data.dislikes } : rec)
      );
    }
  };

  const handleAbonner = async (recommendationId) => {
    const res = await fetch(`${API_URL}/test/interractions/${recommendationId}/abonner`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.recommendationId === recommendationId
            ? { ...rec, abonnés: data.abonnés || [], abonnementsCount: data.abonnementsCount || 0 }
            : rec
        )
      );
    } else {
      const errorData = await res.json();
      console.error("Erreur abonnement :", errorData.message);
    }
  };


const location = useLocation();

const handleReload = () => {
  if (location.pathname === '/Interraction') {
    window.location.reload();
  }
};

const navigate = useNavigate()

const handleClick = (id) => {

  navigate(`/BigView/${id}`);
}


  return (
    <>
      <Header disabled={true}  />
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className={`flex min-h-screen flex-wrap px-12 ${changetheme ? `bg-[#000000d1] text-white` : ``} pt-30 gap-x-16 gap-y-10 justify-center p-4`}>
               
 
        {recommendations.map((rec) => (
        < PageWrapper   key={rec._id} >
          <div
          
            className={`w-[300px] ${changetheme ? `bg-[#000000d1] text-white shadow-[0px_0px_1px_1px_#00ced15c]` : `bg-[#f5f5f587] shadow-[0px_0px_6px_0px_#00000038]`} rounded-[8px] p-2`}
          >
            <img
              src={rec.Image}
              alt={rec.Titre}
              className="w-full h-[250px] object-fill rounded"
            />

            <p className="mt-2 font-semibold text-sm"><strong>Titre :</strong> {rec.Titre ? rec.Titre.replace(/<[^>]+>/g, '').split(' ').slice(0, 5).join(' ') + '…' : 'Aucune description'}</p>
            <p className="mt-2 font-semibold text-sm"><strong>Auteur :</strong> {rec.Auteur}</p>

            <div className="mt-1 flex items-center gap-x-1">
  <strong  >Notes : </strong>
  {[1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      className="text-xl"
      style={{
        color: i <= Math.round(Number(rec.Notes)) ? 'gold' : 'lightgray'
      }}
    >
      ★
    </span>
  ))}
  <span className="text-sm ml-2">
    {typeof rec.Notes === 'number' ? rec.Notes.toFixed(1) : "Aucune"}
  </span>
</div>

            <p className="mt-2 font-semibold text-sm"><strong>Description :</strong> {rec.Description ? rec.Description.replace(/<[^>]+>/g, '').split(' ').slice(0, 4).join(' ') + '…' : 'Aucune description'}</p>
            <p className="mt-2 font-semibold text-sm"><strong>Publié par :</strong> {rec.userId?.prenom || "Utilisateur inconnu"}</p>

            <div className="flex gap-x-6 py-3">
              <div className="flex items-center gap-2">
                <BiSolidLike
                  className="text-[30px] shadow-[0px_0px_8px_0px_gainsboro] p-1 rounded-[5px] cursor-pointer"
                  onClick={() => { handleLike(rec._id) ; handleReload()}}
                />
                <span>{rec.likes?.length || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                <BiSolidDislike
                  className="text-[30px] shadow-[0px_0px_8px_0px_gainsboro] p-1 rounded-[5px] cursor-pointer"
                  onClick={() => {handleDislike(rec._id) , handleReload() }}
                />
                <span>{rec.dislikes?.length || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`shadow-[0px_0px_8px_2px_gainsboro] py-2 px-3 rounded-[6px] cursor-pointer
                    ${rec.abonnés?.includes(userId) ? 'bg-blue-400 text-white' : ''}
                    hover:bg-blue-400 hover:text-white`}
                  onClick={() => { handleAbonner(rec.recommendationId) ; handleReload() }}
                >
                  {rec.abonnés?.includes(userId) ? "Abonné" : "S'abonner"}
                </button>
                <span>{rec.abonnés?.length || 0}</span>


              </div>



            </div>
              <div className='flex justify-end '>
                           <BsFillPlusCircleFill className="text-[30px] text-[#00ced15c] cursor-pointer  "  
                           
                           onClick={() =>  handleClick(rec.recommendationId)} />

              </div>


          </div></PageWrapper>
        ))}     
      </div> 

    </>
  );
};

export default Interraction;
