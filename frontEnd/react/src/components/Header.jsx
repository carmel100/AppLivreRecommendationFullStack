import { IoSunny } from "react-icons/io5";

import { IoMoonSharp } from "react-icons/io5";

import { IoSearch } from "react-icons/io5";

import { useState } from "react";

import { Link } from "react-router-dom";

import store from "../librairies/zustand";

import { IoIosArrowForward } from "react-icons/io";

import { IoIosArrowDown } from "react-icons/io";

import { AiOutlineInteraction } from "react-icons/ai";

import { MdOutlineNoteAdd } from "react-icons/md";

import { CgNotes } from "react-icons/cg";

import { GiHamburgerMenu } from "react-icons/gi";

import { IoClose } from "react-icons/io5";

import { useLocation } from "react-router-dom";

import logo from "../assets/logo1.svg"
import LogoutButton from "./logout";
import ProfileAvatar from "./ProfileAvatar";

  const Header = ({ disabled = false  , backgroundColor = '#00ced11f' })  => {

    const [menu,setMenu]  = useState('')


    const handleMenu = () =>{

        setMenu(menu => !menu)
    }


  //  const [changetheme,setChangetheme] = useState('')

 // const {changetheme,setChangetheme} = store

   const user1 = store((state) => state.user);

   console.log(user1);
   


  const changetheme = store((state) => state.changetheme);
  const setChangetheme = store((state) => state.setChangetheme);

    const [mousechange,setMousechange] = useState('')


    const [mousechange2,setMousechange2] = useState('')


      function clickChange() {
        
        setChangetheme(prev => !prev)
      }

      function Mouseenter1() {
        
         setMousechange(true)
      }

      function Mouseleave1(){

        setMousechange(false)
      }

     

        function Mouseenter3() {
        
       setMousechange2(prev => !prev)
      }

      function Mouseleave3(){

        setMousechange2(prev => !prev)
      }

     const word = store((state) => state.word);
  const setWord = store((state) => state.setWord);
 
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.warn("Utilisateur malformé dans localStorage", e);
  }

  const [localuser,setLocaluser] = useState('')

   function handleUser() {
     setLocaluser(prev => !prev)
   }

   const [Recomend,setRecomend] = useState('')


   function handleRecomnd() {
    setRecomend(prev => !prev)
   }


    const incrementRefreshKey =  store((state) => state.incrementRefreshKey);

const location = useLocation();

const handleReload = () => {
  if (location.pathname === '/Accueil') {
    incrementRefreshKey(); // relance les useEffect dépendants
  }
};

const handleReload1 = () => {
  if (location.pathname === '/CardRecommendation') {
    window.location.reload();
  }
};


const handleReload2 = () => {
  if (location.pathname === '/Interraction') {
    window.location.reload();
  }
};

     
    return(
        

    <>
    
    <div className={`shadow-[1px_0px_1px_grey] z-[6]  ${changetheme ? `bg-[#000000d1] text-white` :`bg-[#fffffff5]`} top-[-1px]  fixed w-full`}  >

      <ul  className="flex justify-between items-center   max-ds:mx-[10px] ds:mx-[40px] py-[20px]">
        <li className="size-max">
            <img src={logo} alt="logo du site"  className=" max-w-[fit-content]   max-ls:h-[30px] ls:h-[50px]" />
        </li>
        <div  className={` w-[1100px]  ${menu ? `max-ls:top-[78px]  max-rs:h-[145px] max-rs:grid max-rs:items-center` : `rs:h-fit max-rs:grid max-rs:items-center`}   rs:flex justify-around   max-rs:absolute max-rs:top-[89px] max-rs:w-[100%] max-rs:left-0   ${changetheme ? `max-rs:bg-[#000000d1] max-rs:text-white` :`max-rs:bg-[#fffffff5]`}   rs:bg-transparent `} >   
        <li  className={` ${menu ? `relative top-[61px] ` :``} `}>
            <ul className={` rs:flex  items-center ${menu ? `max-rs:grid max-rs:text-center`:` max-rs:hidden`}  justify-start max-ss:gap-x-1   ss:gap-x-14 items-center`}>
              <li  className={`${menu ? ` max-ls:left-[0px] max-rs:relative max-rs:top-[-20px] max-rs:left-[76px]`: ``}`}><Link to='/Accueil' className={`py-[6px] px-[12px] rounded-[8px] duration-300 ${mousechange ? 'bg-[aliceblue] text-[#0000ffa6]' : ''} `} onMouseEnter={Mouseenter1}  onMouseLeave={Mouseleave1}  onClick={handleReload} > Accueil </Link> </li>
                 <div onClick={handleRecomnd}>
                <li className={`  ${menu ? `max-ds:w-auto max-ds:relative max-ls:left-0  max-ds:left-[85px]` : `max-ds:w-[157px]`} ds:w-[265px] flex items-center ds:justify-between max-ds:justify-center py-[6px] px-[12px] rounded-[8px] duration-300 ${mousechange2 ? 'bg-[aliceblue] text-[#0000ffa6]' : ''} `} onMouseEnter={Mouseenter3}  onMouseLeave={Mouseleave3} >
                  Interaction &   <p className={` max-ds:block  ds:hidden ${menu ? `max-ds:hidden`:`max-ds:block`}`}>...</p>  <p className={` ${menu ? `max-ds:block` : `max-ds:hidden` } ds:block   `}> Recommendations</p> 

                   { Recomend ? <IoIosArrowDown />

                    :  <IoIosArrowForward  /> }
                </li>
    
                 </div>

                 <div className={` max-rs:top-[70px]   max-rs:justify-items-center max-rs:left-[-254px] max-rs:z-[-1] max-rs:right-[-254px] max-rs:w-[-webkit-fill-available]   absolute ${Recomend ? `block`: `hidden` } shadow-[0px_0px_12px_0px_lightblue]  top-[76px] left-[353px] ${changetheme ? `bg-[#000000d1] text-white` :`bg-[#fffffff5]`}  p-2.5 rounded-[8px]`}>
                  <ul>
                    <li  >

                        <Link to= "/AddRecommendation" className="flex   rs:items-center gap-x-[8px] my-1 p-2 hover:bg-[aliceblue] rounded-[8px] hover:text-blue-400"  > 
                        
                          <MdOutlineNoteAdd  className="text-[30px]" />

                      Ajouter une recommendation

                        </Link>
                    
                      
                      </li>
                    <li >
                    <Link to="/CardRecommendation" onClick={handleReload1}   className="flex   rs:items-center gap-x-[8px] p-2 mb-1 hover:bg-[aliceblue] rounded-[8px] hover:text-blue-400 " >

                       <CgNotes className="text-[30px]"   />

                      Voir mes recommandations 
                      </Link>
                       </li>
                    <li >

                     <Link to="/Interraction"  onClick={handleReload2} className="flex     rs:items-center gap-x-[8px] p-2 mb-1 hover:bg-[aliceblue] rounded-[8px] hover:text-blue-400 " >

                        <AiOutlineInteraction className="text-[30px]" />

                       voir mes interactions
                     </Link>

                   </li>
                  </ul>
                 </div>
            </ul>
        </li>
        <li className={` ${menu ? `relative bottom-[95px]` : ``} `}> 

                                 <div  className="relative w-auto ">

            <input type="text" disabled ={disabled}  style={{backgroundColor:backgroundColor}}  className={` h-[35px]  ${menu ? `max-rs:block max-rs:w-[400px]  max-ls:w-[250px]`:`max-rs:hidden`}  rs:block bs:w-[400px] ss:w-[300px] max-ss:w-[200px]  rounded-full outline-0 ps-3 pe-12 `} value={word} onChange={(e) => setWord(e.target.value)}
             placeholder="Entrez le titre, l'auteur ou le genre  " />
             <span  className=" absolute inset-y-0 right-5 flex items-center  ">

            <IoSearch className={`  text-[21px] text-[#0000ffa6] ${menu ?  `max-rs:block ` : `max-rs:hidden `} rs:block `}  />
                  </span>
              </div>
             </li>
        <li className={`flex size-fit    max-rs:hidden ${changetheme ?   `bg-white `   :  `bg-[#0000ff7d] `}   rs:block  max-ds:w-[71px] ds:w-[111px] h-[34px] duration-1000    rounded-full justify-between   `} >
         <IoSunny className={`  transition-all duration-500     ${changetheme ?'opacity-0 pointer-events-none' : 'opacity-100'} rounded-full h-[32px]  w-[32px] p-[6px] text-[yellow] bg-[#0000003b] top-[1px]   left-[0px] `}   onClick={clickChange}/>
         <IoMoonSharp className={` transition-all duration-500 ${changetheme ? 'opacity-100' : `opacity-0 pointer-events-none` }  rounded-full h-[32px] w-[32px] p-[6px] text-[yellow] bg-[#000000ba]  max-ds:left-[39px] top-[-31px]   ds:left-[78px] relative    `} onClick={clickChange}  />
        </li>
        </div>
        <div className="flex justify-between items-center rs:max-w-40 max-rs:w-[223px] max-fs:w-[180px]   ds:max-w-fit ds:w-auto  ">

        <li className={`flex size-fit    max-rs:block  rs:hidden  max-ds:w-[30px] ds:w-[111px] h-[34px] duration-1000  rounded-full justify-between   `} >
         <IoSunny className={`  transition-all duration-500     ${changetheme ?'opacity-0 pointer-events-none' : 'opacity-100'} rounded-full h-[32px]  w-[32px] p-[6px] text-[yellow] bg-[#000000ad] top-[1px]   left-[0px] `}   onClick={clickChange}/>
         <IoMoonSharp className={` transition-all duration-500 ${changetheme ? 'opacity-100' : `opacity-0 pointer-events-none` }  rounded-full h-[32px] w-[32px] p-[6px] text-[yellow] bg-[#fdfdfd87]  max-ds:left-[0px] top-[-31px]   ds:left-[78px] relative    `} onClick={clickChange}  />
        </li>

    <GiHamburgerMenu onClick={handleMenu} className={` rs:hidden ${menu ? `max-rs:hidden` : `max-rs:block`      }  ${changetheme ? ` text-white` :`text-[#000000d4]`}   text-[40px] `} />

    <IoClose  onClick={handleMenu} className={`text-[40px] text-[#000000d4]    ${changetheme ? ` text-white` :`text-[#000000d4]`}    ${menu ? `max-rs:block` : `max-rs:hidden`  } hidden `} /> 

        <li className={`flex  duration-300 items-center max-fs:gap-[0px] fs:gap-x-[6px]   ${changetheme ? `shadow-[0px_0px_2px_2px_grey]` :`shadow-[0px_0px_3px_0px_grey]`}    rounded-full py-[2px] max-fs:px-[0px] fs:px-[12px]`} onClick={handleUser}>
              {user && user.prenom }

              {user1 && user1.prenom }

   { !localuser ?  <IoIosArrowForward className="pt-0.5" />

      :<IoIosArrowDown  className="pt-0.5"  /> }
        </li>
         </div>
         <div className={`absolute transition-all duration-1000  ${changetheme ? `bg-[#000000d1] text-white` :` bg-white`}  shadow-[0px_0px_5px_0px_lightblue] ${localuser ? 'block' : ' hidden'  } top-[74px] right-[9px] w-[250px] rounded-[8px] text-center`}>
          <ul>
            <li className="py-[40px] flex justify-center">
  <ProfileAvatar
    firstName={user?.prenom || user1?.prenom || "Utilisateur"}
    lastName={user?.nom || user1?.nom || ""}
  />            </li>
            <li className="pb-2">
              {user && user.prenom + ' ' + user.nom}
             {user1 && user1.prenom + '' +   user1.nom }
            </li>
            <li className="pb-2">
          {/*user && user.email */}
          {user1 && user1.email }

            </li>
            <li className="py-2">
              <LogoutButton/>
            </li>
          </ul>
         </div>

      </ul>                                                                                                                                                       
    
    </div>
    
    </>
    )
    
     
  }


  export default Header