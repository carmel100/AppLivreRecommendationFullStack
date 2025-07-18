import RatingStars from './RatingStars';

const BookCard = ({ book }) => {
  const volume = book.volumeInfo || book; // gère Google Books ou MongoDB

  return (
    <div className="w-[300px] p-4 bg-white shadow-md rounded-md text-black">
      <img
        src={volume.imageLinks?.thumbnail || volume.Image}
        alt={volume.title || volume.Titre}
        className="w-full h-[200px] object-cover mb-3 rounded"
      />
      <h3 className="font-bold text-lg">{volume.title || volume.Titre}</h3>
      <p className="text-sm text-gray-600 mb-2">
        {volume.authors?.join(', ') || volume.Auteur}
      </p>
      <p className="text-sm line-clamp-3 mb-3">
        {volume.description?.slice(0, 100) || volume.Description?.slice(0, 100)}…
      </p>

      {/* ⭐ Composant de notation */}
      <RatingStars
        bookId={book.id || book.googleBookId} // ID unique
        title={volume.title}
        authors={volume.authors}
        description={volume.description}
        publisher={volume.publisher}
        publishedDate={volume.publishedDate}
      />
    </div>
  );
};

export default BookCard;
