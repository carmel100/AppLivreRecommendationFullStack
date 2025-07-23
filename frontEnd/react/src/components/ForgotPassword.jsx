
  import { useState } from "react";
   import API_URL from "../librairies/config";
   import store from "../librairies/zustand";
  const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage("Un email de réinitialisation a été envoyé.");
    } else {
      setMessage(data.message || "Erreur.");
    }
  };


    return(

        <>
       <div  className={` ${changetheme ? `bg-[#000000d1] text-white` : ``} h-[100vh]`}>
       <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Mot de passe oublié</h2>
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4"
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2">Envoyer</button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </form>
        </div>
         
        </>
    )
  }

  export default ForgotPassword