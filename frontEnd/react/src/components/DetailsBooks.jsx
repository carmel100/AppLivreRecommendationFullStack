
  import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import store from '../librairies/zustand';
import RatingStars from './Raitings';
import PageWrapper from './PageWrapper';

  const DetailsBooks = () =>{

 const { livreId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  

 const changetheme = store((state) => state.changetheme);



   useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${livreId}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [livreId]);

  
  if (loading) return <p>Chargement...</p>;
  if (!book) return <p>Livre introuvable.</p>;

  const info = book.volumeInfo;



 return(
    <>
    
    <Header  disabled={true}    />

  <PageWrapper>  
    <div  className={`px-8 pt-28 h-[100vh] ${changetheme ? `text-white bg-[#000000d1]` :` bg-white`}  `}>
      <h1>{info.title}</h1>
      <h3>Auteur(s) : {info.authors?.join(', ') || 'Inconnu'}</h3>
      <p><strong>Publié le :</strong> {info.publishedDate}</p>
      <p><strong>Éditeur :</strong> {info.publisher}</p>
      <p><strong>Description :</strong></p>
      <RatingStars bookId={livreId} />
      <p dangerouslySetInnerHTML={{ __html: info.description || 'Aucune description disponible.' }} />
    </div>
</PageWrapper>
    </>
    
)


  }

  export default DetailsBooks