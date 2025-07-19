
 
import { BrowserRouter } from "react-router-dom"
import Routes1 from "./routes/Routes1"
import { useEffect } from "react";
import { useLocation , useNavigate} from "react-router-dom";

function App() {

  const location = useLocation();

  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
  
    if (token) {
      localStorage.setItem("token", token);
      navigate("/Accueil", { replace: true });
    }
  }, [location, navigate]);
 
  return (
    <>
    <BrowserRouter>
        <Routes1 />     
    </BrowserRouter>
    </>
  )
}

export default App
