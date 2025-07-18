

  import { BsFillPlusCircleFill } from "react-icons/bs";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import store from "../librairies/zustand";
import PageWrapper from "./PageWrapper";
import { FaTrashCan } from "react-icons/fa6";


const CardItemRecommendation = ({ Titre, Auteur, Description, Image, Notes, Pointe, likesCount, dislikesCount, abonnementsCount , handleClick1 , suppimerRecommendation }) => {
  const changetheme = store((state) => state.changetheme);

const note = typeof Notes === "number" ? Notes : 0; // fallback à 0 si null

       console.log("Notes reçu dans CardItemRecommendation:", Notes, typeof Notes)

        

  return (
    <PageWrapper>
      <div className={`w-[300px] ${changetheme ? `bg-[#000000d1] text-white shadow-[0px_0px_1px_1px_#00ced15c]` : `bg-[#f5f5f587] text-black shadow-[0px_0px_6px_0px_#00000038]`} rounded shadow p-2`}>
        <img src={Image} alt={Titre} className="w-full h-[250px] object-fill rounded" />
        
        <p className="mt-2 font-semibold text-sm"><strong>Titre :</strong> {Titre}</p>
        <p className="mt-2 font-semibold text-sm"><strong>Auteur:</strong> {Auteur}</p>

       {/* ✅ Étoiles pour la note */}
<div className="mt-2 flex items-center">
  <strong className="text-sm mr-2">Notes :</strong>
  {[1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      className="text-xl"
      style={{ color: i <= Math.round(note) ? 'gold' : 'lightgray' }}
    >
      ★
    </span>
  ))}
  <span className="text-sm ml-2">
    {note > 0 ? (note > 5 ? "5.0" : note.toFixed(1)) : "Aucune"}


  </span>
</div>





        <p className="mt-2 font-semibold text-sm"><strong>Description:</strong> {Description}</p>

        <div className="flex gap-x-6 py-3">
          <div className="flex items-center gap-2">
            <BiSolidLike className="text-[30px] text-green-600"   />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <BiSolidDislike className="text-[30px] text-red-600" />
            <span>{dislikesCount}</span>
          </div>
          <div className="flex items-center gap-2">  
            <span className="text-sm">Abonnés : {abonnementsCount}</span>
      
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 duration-200" onClick={Pointe}>
            Publier
          </button>
          <FaTrashCan className="text-[30px] text-red-600 cursor-pointer"  onClick={suppimerRecommendation} />

          <BsFillPlusCircleFill className="text-[30px] text-[#00ced15c] cursor-pointer" 
          onClick={handleClick1} />
        </div>
      </div>
    </PageWrapper>
  );


};
  
export default CardItemRecommendation;