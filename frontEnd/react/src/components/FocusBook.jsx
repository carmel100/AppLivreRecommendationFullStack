import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs"; // N'oublie pas ça !

const FocusBook = () => {
  const { livreId } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${livreId}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch(console.error);
  }, [livreId]);

  if (!book) return <p>Chargement...</p>;

  const info = book.volumeInfo;

  return (
    <div className="w-[300px] bg-[#f5f5f587] rounded shadow-[0px_0px_6px_0px_#00000038] p-2">
      <img
        src={info.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
        alt={info.title}
        className="w-full h-[300px] object-fill rounded"
      />
      <p className="mt-2 font-semibold text-sm">{info.title}</p>
      <p className="mt-2 font-semibold text-sm">
        Auteur : {info.authors?.join(", ") || "Inconnu"}
      </p>
      <p className="mt-2 font-semibold text-sm">
        Genre : {info.categories?.join(", ") || "Non précisé"}
      </p>

      <BsFillPlusCircleFill className="relative left-[248px] top-[-2px] text-[30px] text-[#00ced15c]" />
    </div>
  );
};

export default FocusBook;
