
  import { useState } from "react";
   import API_URL from "../librairies/config";
  const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
        </>
    )
  }

  export default ForgotPassword