
// Exemple : LogoutButton.jsx
const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include", // important si tu utilises les cookies
      });

      const data = await res.json();
      console.log("✅", data.message);

      // Redirection ou nettoyage local
      localStorage.clear(); // si tu stockais autre chose
      window.location.href = "/"; // ou navigation via React Router
    } catch (err) {
      console.error("❌ Erreur de déconnexion :", err);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 hover:text-red-500 hover:bg-transparent hover:shadow-[0px_0px_1px_1px_#fb2c36] text-white px-4 py-2 rounded">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
