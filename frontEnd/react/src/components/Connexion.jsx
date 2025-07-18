import { useState ,useEffect } from "react"

import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

  import { IoMdEye } from "react-icons/io";

   import { IoMdEyeOff } from "react-icons/io";

   import store from "../librairies/zustand";

   import { MdLightMode } from "react-icons/md";
   
import { MdNightlight } from "react-icons/md";

 import { ToastContainer, toast } from 'react-toastify';

 import API_URL from "../librairies/config";

       

      const Connexion = ({img1,img2,img3}) => {





    const notify = () => toast()


         const [loading, setLoading] = useState(false);


          const [email,setEmail] = useState('')

          const [motdepasse,setMotdepasse] = useState('')

              const [show ,setShow] = useState('')

            const navigate = useNavigate();



  // 🔒 Empêche l'accès si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Vérifie que le token est valide auprès du backend
      fetch(`${API_URL}/accueil`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            navigate("/Accueil"); // ✅ Redirige si le token est valide
          }
        })
        .catch(() => {
          // Token invalide ou erreur serveur : rien à faire, rester sur la page login
          localStorage.removeItem("token"); // Nettoyage si nécessaire
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


         
            function handleSubmit(e) {
               
               e.preventDefault()

                 setLoading(true);

                 fetch(`${API_URL}/auth`,{

                 method : "POST" ,

                 headers : {

                  "Content-type" : "application/json"
                 } ,

                 body : JSON.stringify({  email : email , motdepasse : motdepasse })
                
           })
               .then((response) => response.json())
              .then((data) => {
               
               console.log( data);

              
             // Ici tu peux enregistrer le token ou rediriger l'utilisateur
                 
           localStorage.setItem("token", data.token);

         

      if (data.token && data.user) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user)); // 👈 ICI !
   toast.success("Connexion réussi",{ position: "top-center",autoClose:3000 ,theme: "light", 

    style :{ backgroundColor:"rgba(255, 255, 255, 0.3)" },
    backdropFilter: "blur(10px)",
    color:"white"
   }
    )


setTimeout(() => {
  navigate("/Accueil");
}, 1000)

} else {
  setLoading(false);
  toast.error("Échec de l'authentification", {position: "top-center",
  theme: "light",autoClose:3000    ,  
 style :{ backgroundColor:"rgba(255, 255, 255, 0.3)" },
    backdropFilter: "blur(10px)",
    color:"white" 

  });
}

                 
                 })

                 
              .catch((err) => {
               console.error("Erreur de connexion :", err);
               })
               .finally(() => setLoading(false)); // ✅ Arrêt du chargement
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


                    
        <div className={`grid justify-center ${changetheme ?  `bg-[#000000d1]  text-white` : ``} duration-700  h-[100vh] items-center`}>

             <div className="flex justify-end  pe-4">

                      
                   <MdNightlight  onClick={handleTheme}  className={` ${changetheme ? `` : `hidden` }  text-yellow-400   text-[38px] border-[1px] border-solid rounded-full p-[4px]`} />
            
                   <MdLightMode  onClick={handleTheme} className={` ${changetheme ? `hidden` : ` ` }   text-yellow-400 bg-black  text-[38px] border-[1px] border-solid rounded-full p-[4px]`} />
                   </div>

           
               <form className="grid  h-fit shadow-[0px_0px_3px_0px] rounded-[5px] py-8"  onSubmit={handleSubmit}>
              <div className="  py-2  ps:grid sm:flex max-ps:grid sm:w-[550px] ps:w-[400px] max-ps:w-[300px]  max-ps:justify-center  ps:justify-center sm:justify-between items-center px-4">
                <label htmlFor="email"  className="  max-ps:pb-1 ps:pb-1" >Email</label>
                <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "  />
            </div>
             <div  className="sm:flex max-sm:hidden justify-end  ps-[78px] pe-6  gap-x-2 pt-2">
                  <Link  to="/forgot-password" className="hover:text-blue-500" > Mot de passe oublié ?</Link>  
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
          <AiOutlineLoading3Quarters className={`${ loading ? "animate-spin text-indigo-500" : "hidden"}   relative left-[86px] top-[4px] text-[26px]`}/>
                <input type="submit" disabled={loading} onClick={notify}
  value={loading ? "Connexion en cours..." : "Se connecter"} 
    className={`hover:text-indigo-500 hover:bg-white hover:shadow-[0px_0px_2px_0px] sm:w-[400px] max-ps:w-[250px]  ps:w-[300px] h-[35px] bg-indigo-500 text-[20px] text-white rounded-[5px]`}  />
            <ToastContainer 
            hideProgressBar={true}             
  closeOnClick={true}                 
  pauseOnFocusLoss={true}            
  draggable={true}                   
  autoClose={true}                  
  newestOnTop={true}                 
  pauseOnHover={true}               
  rtl={false}                        
  position="top-center"              
  theme="light"   
            
            />
             </div>
            <div className="flex justify-center  px-4  pb-2 pt-5 gap-x-5 ">
                <div className="shadow-[0px_0px_3px_0px] rounded-[5px]  max-ps:ms-0 ps:ms-0 sm:ms-24"  >
                 <a href={`${API_URL}/auth/google`} >

                <img src={img1} alt="" className="w-[60px] h-[60px] p-1.5 " />
                </a>
                </div>
                <div className=" shadow-[0px_0px_3px_0px] rounded-[5px]">
                  <a href={`${API_URL}/auth/microsoft`} > 
                 <img src={img2} alt="" className="w-[60px] h-[60px] p-1.5"/>
                 </a>  
              </div>
                <div className="shadow-[0px_0px_3px_0px] rounded-[5px] ">
                       <a href={`${API_URL}/auth/github`}>
                      <img src={img3} alt="" className="w-[60px] h-[60px] p-2.5"/>

                         </a>
                  
               </div>

            </div>

          

            <div className="flex justify-center   max-sm:ps-[0px] sm:ps-[78px] gap-x-2 pt-3">
               Si vous n'avez pas de compte <Link to="/Inscription" className="hover:text-blue-500"> cliquez ici </Link>
            </div>

            </form>
         
 
            </div>


            </>
         )

      }

      export default Connexion