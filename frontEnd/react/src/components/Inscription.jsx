import { useState } from "react"

   import { IoMdEye } from "react-icons/io";

   import { IoMdEyeOff } from "react-icons/io";

import { MdLightMode } from "react-icons/md";
   
import { MdNightlight } from "react-icons/md";


 import { ToastContainer, toast } from 'react-toastify';

 import store from "../librairies/zustand";

 import API_URL from "../librairies/config";

  const Inscription = () => {

     const notify = toast()
 
    const[nom,setNom] = useState('')

    const [prenom,setPrenom] = useState('')

    const[email,setEmail] = useState('')

    const [motdepasse,setMotdepasse] = useState('')

    const [show ,setShow] = useState('')
function handleSubmit(e) {
  e.preventDefault();

  console.log("Données envoyées :", { nom, prenom, email, motdepasse }); // 👈 ici

  fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ nom, prenom, email, motdepasse })
  })
    .then((r) => r.json())
    .then((data) => {
       console.log(data)

       toast.success(" Inscription réussi ", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          color: "white"
        }
      })

       setTimeout(() => {
    window.location.href = "/";
  }, 5000);

    

      })
    .catch((error) => {
      console.log('inscription échouée', error);

      toast.error("inscription échouée", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          color: "white"
        }
      })
    });
}


   function handleShow(){

       

      setShow( (prev) => !prev) 
   }

   const changetheme = store((state) => state.changetheme);
  const setChangetheme = store((state) => state.setChangetheme);

    const handleTheme = () =>{

      setChangetheme(prev =>!prev)
       
    }

      return(

       <>

       
        <div className={`grid justify-center ${changetheme ?  `bg-[#000000d1] text-white` : ``}  duration-700 h-[100vh] items-center`}>

  <div className="flex justify-end  pe-4">

                      
                   <MdNightlight  onClick={handleTheme}  className={` ${changetheme ? `` : `hidden` }  text-yellow-400   text-[38px] border-[1px] border-solid rounded-full p-[4px]`} />
            
                   <MdLightMode  onClick={handleTheme} className={` ${changetheme ? `hidden` : ` ` }   text-yellow-400 bg-black  text-[38px] border-[1px] border-solid rounded-full p-[4px]`} />
                   </div>

             <form className="grid  h-fit shadow-[0px_0px_3px_0px] rounded-[5px] py-[32px]"  onSubmit={handleSubmit}>

            <div className=" py-2  ps:grid sm:flex max-ps:grid  max-ps:w-[300px]  ps:w-[400px]  sm:w-[550px]   ps:justify-center max-ps:justify-center  sm:justify-between items-center px-4">
                <label htmlFor="nom"  className="  max-ps:pb-1 ps:pb-1" >Nom</label>
                <input type="text"  id="nom" required value={nom} onChange={(e) => setNom(e.target.value)} className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] " />
            </div>

            <div className=" py-2 ps:grid sm:flex max-ps:grid sm:w-[550px] max-ps:w-[300px] ps:w-[400px]  max-ps:justify-center ps:justify-center sm:justify-between items-center px-4">
                <label htmlFor="prenom"  className="   max-ps:pb-1 ps:pb-1" >Prenom</label>
                <input type="text"  id="prenom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} className=" sm:w-[400px] max-ps:w-[250px]  ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "  />
            </div>

            <div className="  py-2  ps:grid sm:flex max-ps:grid sm:w-[550px] ps:w-[400px] max-ps:w-[300px]  max-ps:justify-center  ps:justify-center sm:justify-between items-center px-4">
                <label htmlFor="email"  className="  max-ps:pb-1 ps:pb-1" >Email</label>
                <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "  />
            </div>

            <div className="  py-2  ps:grid sm:flex max-ps:grid sm:w-[550px]  ps:w-[400px]  max-ps:w-[300px] max-ps:justify-center ps:justify-center sm:justify-between items-center px-4">
                <label htmlFor="password" className="  max-ps:pb-1 ps:pb-1">Mot de passe</label>
                    <div  className="relative w-auto ">

                <input   type={show ? "text" : "password"}
   id="password" required value={motdepasse} onChange={(e) => setMotdepasse(e.target.value)} className={`sm:w-[400px] max-ps:w-[250px]   ps:w-[300px] h-[35px] ${show ? '' : 'text-[20px] font-bold pt-1'} rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] ` } />
                <span  className=" absolute inset-y-0 right-5 flex items-center ">
                   <IoMdEye className={`text-[20px] ${show ? `` : `hidden`}`} onClick={handleShow} />

              <IoMdEyeOff className={` text-[20px] ${show ? `hidden`: ``}   `} onClick={handleShow} />
                </span>
              
                </div>
            </div>
             
             <div className="flex  max-ps:justify-center ps:justify-center sm:justify-end px-4  py-2">
                <input type="submit" onClick={notify} className="sm:w-[400px] max-ps:w-[250px]  ps:w-[300px] hover:text-indigo-500 hover:bg-white hover:shadow-[0px_0px_2px_0px] h-[35px] bg-indigo-500   text-[20px] text-white rounded-[5px]" value="S'inscrire" />
 <ToastContainer 
            hideProgressBar={true}             
  closeOnClick={true}                 
  pauseOnFocusLoss={true}            
  draggable={true}                   
  autoClose={false}                  
  newestOnTop={true}                 
  pauseOnHover={true}               
  rtl={false}                        
  position="top-center"              
  theme="light"        
            
            />             </div>

             </form>
            
        </div>
       
       </>

      )

  }

  export default Inscription