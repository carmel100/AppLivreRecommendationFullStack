import { useState } from "react";
import CardRecommendation from "../components/CardRecommendation";
import Header from "../components/Header";
import store from "../librairies/zustand";
import { Navigate ,useNavigate} from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
//import { useLocation } from "react-router-dom";

const InteractionEtRecommendation = () => {

  const [form, setForm] = useState({
    Titre: '',
    Auteur: '',
    Description: '',
    Image: '',
    Notes: '',
  });

  //const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

 const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'Image') {
    setForm({ ...form, ImageFile: files[0] });
  } else {
    setForm({ ...form, [name]: value });
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const imageFile = form.ImageFile;
    let imageUrl = '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'recommendation_unsigned'); // ✅ preset Cloudinary

      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dyxkcj2dc/image/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      imageUrl = cloudinaryData.secure_url;
    }

    const payload = {
      Titre: form.Titre,
      Auteur: form.Auteur,
      Description: form.Description,
      Notes: form.Notes,
      Image: imageUrl,
    };

    // 🔐 Récupérer le token JWT
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour publier une recommandation.");
      return;
    }

    const response = await fetch('http://localhost:3000/books/recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ on ajoute le token ici
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Recommandation enregistrée :', data);

if (location.pathname === '/CardRecommendation') {
        window.location.reload(); // Si déjà sur la page, recharge
      } else {
        navigate('/CardRecommendation'); // Sinon, redirige vers elle
      }

    //  setSubmitted(true);
    } else {
      console.error('Erreur côté serveur');
    }
  } catch (error) {
    console.error('Erreur réseau :', error);
  }
};

 /*


  const handleNavigate = () => {

    navigate('/CardRecommendation');
  }
const location = useLocation();


const handleReload = () => {
  if (location.pathname === '/CardRecommendation') {
    window.location.reload();
  }
};*/
   
   const changetheme = store((state) => state.changetheme);


  return (
    <>
    
      <Header disabled={true} backgroundColor="#8080800f" />
   
      <div className={`grid pt-28  ${changetheme ? ` bg-[#000000d1] text-white ` : ``} justify-center h-[100vh] items-center z-[6]`}>
        <PageWrapper>  <form
          className="grid h-fit shadow-[0px_0px_3px_0px] rounded-[5px] py-2.5"
          onSubmit={handleSubmit}
        >
               <div className=" py-2  ps:grid sm:flex max-ps:grid  max-ps:w-[300px]  ps:w-[400px]  sm:w-[550px]   ps:justify-center max-ps:justify-center  sm:justify-between items-center px-4">
         
            <label htmlFor="titre">Titre</label>
            <input
              type="text"
              id="titre"
              name="Titre"
              value={form.Titre}
              onChange={handleChange}
 className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "            />
          </div>

            <div className=" py-2  ps:grid sm:flex max-ps:grid  max-ps:w-[300px]  ps:w-[400px]  sm:w-[550px]   ps:justify-center max-ps:justify-center  sm:justify-between items-center px-4">
            <label htmlFor="auteur">Auteur</label>
            <input
              type="text"
              id="auteur"
              name="Auteur"
              value={form.Auteur}
              onChange={handleChange}
 className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "            />
          </div>

            <div className=" py-2  ps:grid sm:flex max-ps:grid  max-ps:w-[300px]  ps:w-[400px]  sm:w-[550px]   ps:justify-center max-ps:justify-center  sm:justify-between items-center px-4">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="Image"
              accept="image/*"
              onChange={handleChange}
 className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "            />
          </div>

            <div className=" py-2  ps:grid sm:flex max-ps:grid  max-ps:w-[300px]  ps:w-[400px]  sm:w-[550px]   ps:justify-center max-ps:justify-center  sm:justify-between items-center px-4">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="Description"
              value={form.Description}
              onChange={handleChange}
 className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "            />
          </div>

            <div className=" py-2  ps:grid sm:flex max-ps:grid  max-ps:w-[300px]  ps:w-[400px]  sm:w-[550px]   ps:justify-center max-ps:justify-center  sm:justify-between items-center px-4">
            <label htmlFor="notes">Notes</label>
            <input
              type="text"
              id="notes"
              name="Notes"
              value={form.Notes}
              onChange={handleChange}
 className=" sm:w-[400px]  max-ps:w-[250px]   ps:w-[300px] h-[35px] rounded-[5px] ps-1.5 outline-0 shadow-[0px_0px_2px_0px] "            />
          </div>

             <div className="flex  max-ps:justify-center ps:justify-center sm:justify-end px-4  py-2">
          
            <input
              type="submit"
              value="Ajouter"
className="sm:w-[400px] max-ps:w-[250px]  ps:w-[300px] hover:text-indigo-500 hover:bg-white hover:shadow-[0px_0px_2px_0px] h-[35px] bg-indigo-500   text-[20px] text-white rounded-[5px]"
              
            />
            

          </div>
        </form></PageWrapper>
      </div>
 
      {/*submitted && <CardRecommendation {...form} />*/}
     
    </>
  );
};

export default InteractionEtRecommendation;
