/* eslint-disable react-hooks/exhaustive-deps */


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import store from "../librairies/zustand";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import { FaPen } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const BigView = () => {
  const changetheme = store((state) => state.changetheme);
  const { id } = useParams();
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [commentaires, setCommentaires] = useState([]);
  const [nav, setNav] = useState(false);
 

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded._id || decoded.id;
    } catch (e) {
      console.error("Erreur lors du décodage du token :", e);
    }
  }

  const fetchCommentaires = async () => {
    try {
      const res = await fetch(`http://localhost:3000/recommendation/${id}/commentaires`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCommentaires(data.commentaires || []);
        const userComment = data.commentaires.find(c => c.auteur?._id === userId);
        if (userComment) setCommentaire(userComment.contenu);
      }
    } catch (err) {
      console.error("Erreur récupération commentaires :", err);
    }
  };

  const handleComment = async () => {
    if (!commentaire.trim()) return;

    const res = await fetch(`http://localhost:3000/recommendation/${id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contenu: commentaire }),
    });

    const data = await res.json();

    if (res.ok) {
      setCommentaire("");
      await fetchCommentaires();
    } else {
      console.error(data.message);
    }
  };

  const handleDeleteComment = async () => {
    const res = await fetch(`http://localhost:3000/recommendation/${id}/comment`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setCommentaire("");
      await fetchCommentaires();
    } else {
      console.error("Erreur suppression :", await res.json());
    }
  };

 /* useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/recommendation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setRec(data);
        } else {
          setError(data.message || "Erreur lors du chargement");
        }

        await fetchCommentaires();
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur réseau ou serveur.");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchData();
  }, [id, token]);*/
  
useEffect(() => {
  console.log("id :", id);
  console.log("token :", token);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/recommendation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setRec(data);
      } else {
        setError(data.message || "Erreur lors du chargement");
      }

      await fetchCommentaires();
    } catch (err) {
      console.error("Erreur :", err);
      setError("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (token && id) fetchData();
}, [token,id]);


const handleLike = async (id) => {
  const res = await fetch(`http://localhost:3000/test/interractions/${id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    setRec((prev) => ({
      ...prev,
      likesCount: data.likes?.length || 0,
      dislikesCount: data.dislikes?.length || 0
    }));
  } else {
    console.error("Erreur lors du like");
  }
};

const handleDislike = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/test/interractions/${id}/dislike`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setRec((prev) => ({
        ...prev,
        likesCount: data.likes?.length || 0,
        dislikesCount: data.dislikes?.length || 0
      }));
    }
  } catch (err) {
    console.error("Erreur dislike :", err);
  }
};
  /*const handleLike = async () => {
    const res = await fetch(`http://localhost:3000/books/${rec._id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setRec((prev) => ({
        ...prev,
        likesCount: (prev.likesCount || 0) + 1,
        dislikesCount: Math.max((prev.dislikesCount || 1) - 1, 0),
      }));
    }
  };

  const handleDislike = async () => {
    const res = await fetch(`http://localhost:3000/books/${rec._id}/dislike`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setRec((prev) => ({
        ...prev,
        dislikesCount: (prev.dislikesCount || 0) + 1,
        likesCount: Math.max((prev.likesCount || 1) - 1, 0),
      }));
    }
  };*/
/*
const handleLike = async () => {
  const res = await fetch(`http://localhost:3000/recommendation/${rec._id}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    setRec((prev) => ({
      ...prev,
      likesCount: (prev.likesCount || 0) + 1,
      dislikesCount: Math.max((prev.dislikesCount || 1) - 1, 0),
    }));
  }
};

const handleDislike = async () => {
  const res = await fetch(`http://localhost:3000/recommendation/${rec._id}/dislike`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    setRec((prev) => ({
      ...prev,
      dislikesCount: (prev.dislikesCount || 0) + 1,
      likesCount: Math.max((prev.likesCount || 1) - 1, 0),
    }));
  }
};
*/


  const handleAbonner = async () => {
    const res = await fetch(`http://localhost:3000/test/interractions/${id}/abonner`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setRec((prev) => ({
        ...prev,
        abonnés: [...new Set([...(prev.abonnés || []), userId])],
        abonnementsCount: data.abonnementsCount || prev.abonnementsCount || 0,
      }));
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!rec) return <p className="p-4">Aucune recommandation trouvée.</p>;

  return (
    <>
      <Header disabled={true}  />
      <div className={`min-h-screen flex justify-center px-6 py-10 ${changetheme ? "bg-[#000000d1] text-white" : "bg-white text-black"}`}>
        <div className={`max-w-3xl ${changetheme ? "bg-[#000000d1] text-white shadow-[0px_0px_1px_1px_#00ced15c]" : "bg-[#f5f5f587] shadow-[0px_0px_6px_0px_#00000038]"} rounded-[8px] p-4 mt-16`}>
          <h1 className="text-2xl font-bold mb-4">{rec.Titre}</h1>
          <img src={rec.Image || "/default-book.png"} alt={rec.Titre} className="w-full max-ls:h-[350px]  ls:h-[500px] ns:h-[700px]  rounded mb-4" />

          <div className="flex justify-between items-center mb-2">
            <p><strong>Auteur :</strong> {rec.Auteur || "Inconnu"}</p>

          
          </div>

          <p className="pb-2"><strong>Publié par :</strong> {rec.userId?.prenom || "Utilisateur inconnu"}</p>

          <div className="mb-4 whitespace-pre-line">
            <strong>Description :</strong> {rec.Description?.replace(/<[^>]+>/g, "") || "Aucune description fournie."}
          </div>



           <div className="flex justify-between items-center mb-2.5 flex-wrap">

              <div className="flex gap-x-6">
              <div className="flex items-center gap-2">
                <BiSolidLike className="text-[30px] shadow-[0px_0px_8px_0px_gainsboro] p-1 rounded-[5px] cursor-pointer" onClick={() => handleLike(rec._id)} />
                <span>{rec.likesCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <BiSolidDislike className="text-[30px] shadow-[0px_0px_8px_0px_gainsboro] p-1 rounded-[5px] cursor-pointer" onClick={() => handleDislike(rec._id)} />
                <span>{rec.dislikesCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAbonner}
                  className={`shadow-[0px_0px_8px_2px_gainsboro] py-2 px-3 rounded-[6px] cursor-pointer ${rec.abonnés?.includes(userId) ? "bg-blue-500 text-white" : " hover:bg-blue-400 hover:text-white"}`}
                >
                  {rec.abonnés?.includes(userId) ? "Abonné" : "S'abonner"}
                </button>
                <span>{rec.abonnés?.length || 0}</span>
              </div>
            </div>


             <div className="flex justify-end">
            <FaPen className="text-[30px] shadow-[0px_0px_8px_0px_gainsboro] p-1 rounded-[5px] cursor-pointer" onClick={() => setNav(prev => !prev)} />
          </div>


           </div>

         

          <div className={nav ? "block" : "hidden"}>
            <h2 className="text-lg font-semibold mt-4  mb-1.5">Commentaires</h2>
            <div className="mb-4">
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Ajouter ou modifier votre commentaire..."
                className={`w-full p-2 rounded outline-0 shadow-[0px_0px_2px_0px] ${changetheme ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
              />
              <div className="flex items-center gap-3 mt-2">
                <button onClick={handleComment} className={`px-4 py-2 rounded ${changetheme ? "bg-blue-500 text-white" : "bg-blue-600 text-white"}`}>
                  Publier
                </button>
               
              </div>
            </div>

            {commentaires.length > 0 ? (
              commentaires
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((com, index) => (
                  <div key={index} className="mb-2 p-2  rounded-[8px] bg-[#0ee77a] flex justify-between items-center">
                    <div>
                      <p>
                        {com.contenu}
                        {com.auteur?._id === userId && <span className="ml-2 text-xs text-blue-500">(vous)</span>}
                      </p>
                      <span className="text-sm text-gray-500">
                        Posté par {com.auteur?.prenom || "Anonyme"} le {new Date(com.date).toLocaleString()}
                      </span>
                    </div>
                    {com.auteur?._id === userId && (
                      <MdDeleteOutline
                        className="text-red-500 cursor-pointer   text-[30px] "
                        onClick={handleDeleteComment}
                        //title="Supprimer votre commentaire"
                      />
                    )}
                  </div>
                ))
            ) : (
              <p>Aucun commentaire pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};



export default BigView;


