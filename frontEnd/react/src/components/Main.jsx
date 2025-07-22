import store from "../librairies/zustand"
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import { useRef } from "react"
import PageWrapper from "./PageWrapper";

import SkeletonPost from "./SkeletonPost";

import { FiSearch } from "react-icons/fi";

import API_URL from "../librairies/config";
//import Dragbutton from "./Dragbutton";

const Main = () => {
  const word = store((state) => state.word);
  const [livres, setLivres] = useState([]);
  const [livreSelectionneId, setLivreSelectionneId] = useState(null);
  const [livreDetails, setLivreDetails] = useState(null);

  const setLoading1 = store((state) => state.setLoading1);
  const loading1 = store((state) => state.loading1);

  const [papover1,setPapover1] = useState('')

      const constraintsRef = useRef(null)



  const navigate = useNavigate()

  const navigate1 =useNavigate()

  const navigate2 = useNavigate()



  const handleClick1 = () => {

     navigate1('/CardRecommendation')
  }

  const handleClick2 = () => {

     navigate2('/Interraction')
  }


  useEffect(() => {

    setLoading1(true);


    if (!word) return;

    function couperTitre(titre, maxMots = 4) {
      const mots = titre.split(" ");
      if (mots.length <= maxMots) return titre;
      return mots.slice(0, maxMots).join(" ") + "…";
    }
     
   
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(word)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.items) return;

        const livresAvecDetails = data.items.map((item) => ({
          id: item.id,
          titre: couperTitre(item.volumeInfo.title) || "Titre inconnu",
          image: (
            item.volumeInfo.imageLinks?.extraLarge ||
            item.volumeInfo.imageLinks?.large ||
            item.volumeInfo.imageLinks?.medium ||
            item.volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/300?text=No+Image"
          ).replace("http:", "https:"),
          auteur: couperTitre( item.volumeInfo.authors?.join(", ") )|| "Auteur inconnu",
          genre: item.volumeInfo.categories?.join(", ") || "Genre inconnu",
        }));

        setLivres(livresAvecDetails);

         // 👉 Affiche le loader pendant au moins 1.5 seconde
         setTimeout(() => {
          setLoading1(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Erreur API Google Books :", err);
        
        setLoading1(false)

      
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }); },[word] )



  
  useEffect(() => {
    if (!livreSelectionneId) return;

    fetch(`https://www.googleapis.com/books/v1/volumes/${livreSelectionneId}`)
      .then(res => res.json())
      .then(data => setLivreDetails(data))
      .catch(console.error);
  }, [livreSelectionneId]);

     function handleClick() {
      setLivreSelectionneId(prev => !prev)
     }

    function papoverClick() {
      
      setPapover1(prev => !prev)
    }
 


  const ajouterRecommendation = async () => {
    if (!livreDetails) return;
    const token = localStorage.getItem("token");
    const payload = {
      Titre: livreDetails.volumeInfo.title,
      Auteur: livreDetails.volumeInfo.authors?.join(", ") || "",
      Description: livreDetails.volumeInfo.description || "",
      Image: 
        (livreDetails.volumeInfo.imageLinks?.thumbnail || "").replace(/^http:/, "https:"),
      bookId: livreDetails.id,
     // Notes:0,
    };

    try {
      const res = await fetch(`${API_URL}/books/recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      alert("✅ Livre ajouté aux recommandations !");
     // closeModal();
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
      alert("❌ " + err.message);
    }
  };

   const changetheme = store((state) => state.changetheme);

  return (
    <>  
    
     

      <div className={`flex flex-wrap         min-h-screen   ${changetheme ?  `bg-[#000000d1] text-white` : ``} px-12 pt-36 gap-x-16 gap-y-10 justify-center p-4`}>
      {livres.map((livre) =>
  loading1 ? (
    <SkeletonPost key={livre.id} />
  ) : (
    <PageWrapper key={livre.id}>
      <div
        className={`w-[300px]  block ${
          changetheme
            ? `bg-[#000000d1] text-white shadow-[0px_0px_1px_1px_#00ced15c]`
            : `bg-[#f5f5f587] shadow-[0px_0px_6px_0px_#00000038]`
        } rounded-[8px] p-2`}
      >
        <img
          src={livre.image}
          alt={livre.titre}
          className="w-full h-[300px] object-fill rounded"
        />
        <p className="mt-2 font-semibold text-sm"> Titre : {livre.titre}</p>
        <p className="mt-2 font-semibold text-sm">Auteur : {livre.auteur}</p>
        <p className="mt-2 font-semibold text-sm">Genre : {livre.genre}</p>
        <div className="flex justify-end items-center mt-2">
          <BsFillPlusCircleFill
            className="text-[30px] text-[#00ced15c] cursor-pointer"
            onClick={() => setLivreSelectionneId(livre.id)}
          />
        </div>
      </div>
    </PageWrapper>
  )
)}

      
         <div className={`fixed w-[100%] h-[100vh]  top-[0] z-[21] backdrop-blur-[4px] bg-[#0000004d] ${livreSelectionneId ? `` :`hidden`}  `}></div>
           <div className="flex w-full justify-end">
         <RxCross1  className={`fixed z-[22]   top-[10px] text-[30px] ${livreSelectionneId ? `` :`hidden`} `}  onClick={handleClick}/>

           </div>
        {/* Affichage du livre sélectionné */}
        {livreDetails && livreDetails.volumeInfo && (
          <div className={`w-[300px] rounded   ${changetheme ? `bg-[#000000d1] text-white shadow-[0px_0px_1px_1px_#00ced15c]` : ` bg-[#f5f5f587]  shadow-[0px_0px_6px_0px_#00000038] `} top-[65px] p-2 fixed z-[22]  ${livreSelectionneId ? `` :`hidden`} `}>
            <img
              src={
                livreDetails.volumeInfo.imageLinks?.extraLarge ||
                livreDetails.volumeInfo.imageLinks?.large ||
                livreDetails.volumeInfo.imageLinks?.medium ||
                livreDetails.volumeInfo.imageLinks?.thumbnail ||
                "https://via.placeholder.com/300?text=No+Image"
              }
              alt={livreDetails.volumeInfo.title}
              className="w-full h-[300px] object-fill rounded"
            />
            <p className="mt-2 font-semibold text-sm">{livreDetails.volumeInfo.title}</p>
            <p className="mt-2 font-semibold text-sm">
              Auteur : {livreDetails.volumeInfo.authors?.join(", ") || "Inconnu"}
            </p>
            <div className="grid h-[106px] items-center  ">
              <button className="px-3 py-2 bg-blue-500  duration-300 text-white h-fit rounded-[8px] hover:shadow-[0px_0px_1px_1px_#2b7fff] hover:bg-transparent hover:text-blue-500 "  onClick={() =>  navigate(`/books/${livreSelectionneId}`)}>Plus de details  </button>
            <button className="px-3 py-2 bg-green-500 duration-300 text-white h-fit rounded-[8px]  hover:shadow-[0px_0px_1px_1px_#00c951]  hover: hover:bg-transparent hover:text-green-500  "
            
          onClick={ajouterRecommendation}

        
            > Ajouter dans les recommendations </button>
            </div>
            
          </div>
        )}        

      </div>
 <div
  className="fixed top-0 left-0 z-20 w-full h-full pointer-events-none"
  ref={constraintsRef}
>
  <motion.div
    onClick={papoverClick}
    drag
    dragConstraints={constraintsRef}
    dragElastic={0.2}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="pointer-events-auto bg-blue-500 w-12 h-12 rounded-full absolute top-[70px] left-1/2 transform -translate-x-1/2 z-[10] shadow-lg cursor-pointer"
  />
</div>



         <div className={`   ls-[324] ns:h-[500px] overflow-clip  max-fs:w-[255px] max-ls:w-[330px]  w-[400px] ${papover1 ? `` : `hidden` }       max-ls:top-[87px]   z-20 fixed ns:top-[70px]  ls:top-[160px] duration-500 ${changetheme ? `text-white bg-black` :` bg-white`}  shadow-[0px_0px_4px_0px_lightblue]  ns:right-[110px] ls:right-[68px]  max-ls:right-[30px]   rounded-[8px] `}>
                        
                        <div className=" flex justify-between py-6 px-1.5 text-[30px] h-[36px] items-center border-solid border-b-[1px] border-gray-300 ">
              
                       <p> Note importante </p>

                        <RxCross1  onClick = {papoverClick} />

                        </div>

             <div  className={`overflow-y-auto ${changetheme ? `scrollbar-thumb-[#ffffffbb] scrollbar-track-black scrollbar-thin` :` scrollbar-thin scrollbar-thumb-[#000000b4] scrollbar-track-white `}   p-5  ns:h-[470px] max-ls:h-[322px] ls:h-[322px]    `}>


          <p className="text-[25px] "> Bienvenu sur Books  </p>
           <div>
            <p className="text-[20px] py-2 ">Comment Books fonctionne ?</p>

            <div className="">
              Books est un site de recommendation de livre
              
              qui vous donne la possibilité d'avoir des informations
               
              sur n'importe quel livre et vous aurez la 
              
              possibilité de  :
              
             <div className="py-3.5"> 1/ Recommander les livres que vous  
              appeciez aux autres utilisateurs  , ainsi les autres 
              
              utilisateurs pourront appreciez votre recommendation 
              
              en faisant like ,  un dislike ou en  vous abonnant . Vous aurez accès á cette 

              fonction dans la partie  :  <p>  <strong onClick={handleClick1}>  Voir mes recommendations</strong> .</p></div>

            <div> 2/ Vous pouvez interragir avec les recommendations des autres 
             
              utilisateurs et vous pourrez likez , dislikez ou vous abonnez á une recommendation .

              Vous aurez accès á cette fonction dans la partie :
              
                 <strong className="ps-2" onClick={handleClick2}>Voir mes interractions </strong> 
               </div>

               <div className="py-3.5"> 3/ Vous pouvez aussi recommender des livres du menu 
             
              utilisateurs mais vous devez imperativement notez le livre dans la  partie <br /> <strong > Plus de details</strong>  qui 
              
               est accessible en appuyant le boutton :
                
                
                  <BsFillPlusCircleFill
              className=" m-1 text-[30px] text-[#00ced15c] cursor-pointer"
              
            /> 
              
               sinon la note sera nulle  dans la recommendation ou interractions
               </div>
            </div>
           </div>
          </div>
</div>
         


     
    </>
  );
};

export default Main;