
  import { useState } from "react";
   import API_URL from "../librairies/config";
   import store from "../librairies/zustand";

   import { ToastContainer, toast } from 'react-toastify';

  const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  //const [message, setMessage] = useState("");

  const notify = toast()


  const changetheme = store((state) => state.changetheme);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Un email de réinitialisation a été envoyé.");

      toast.success('Un email de réinitialisation a été envoyé.',{
        position: "top-center",
          theme: "light"
               })
    } else {
      console.log(data.message || "Erreur.");
      toast.error(data.message || "Erreur.",{
        position: "top-center",
          theme: "light"
               })
    }
  };


    return(

        <>
       <div  className={` ${changetheme ? `bg-[#000000d1] text-white` : ``} h-[100vh]`}>
       <form onSubmit={handleSubmit} className="pt-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Mot de passe oublié</h2>
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4"
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={notify}>Envoyer</button>
      {/*message && <p className="mt-2 text-sm text-gray-700">{message}</p>*/}
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
            
            />   
    </form>
        </div>
         
        </>
    )
  }

  export default ForgotPassword