import { useEffect, useState } from 'react';

const RatingStars = ({ bookId, title, authors, description, publisher, publishedDate }) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  // 🔄 Charger la note actuelle
  useEffect(() => {
    fetch(`http://localhost:3000/api/books/${bookId}`)
      .then(res => res.json())
      .then(data => {
        if (data.averageRating) {
          setRating(Math.round(data.averageRating));
        }
      })
      .catch(err => {
        console.error("Erreur lors du chargement des notes :", err);
      });
  }, [bookId]);

  const handleRate = (note) => {
    if (submitted) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("❌ Vous devez être connecté pour noter.");
      return;
    }

    fetch(`http://localhost:3000/api/books/${bookId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ Envoie du token
      },
      body: JSON.stringify({
        rating: note,
        title,
        authors,
        description,
        publisher,
        publishedDate,
      }),
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 400 && data.message === 'Vous avez déjà évalué ce livre.') {
            setMessage("⚠️ Vous avez déjà évalué ce livre.");
            setSubmitted(true);
          } else if (res.status === 401) {
            setMessage("❌ Vous devez être connecté pour noter.");
          } else {
            setMessage(data.message || "❌ Une erreur est survenue.");
          }
          return;
        }

        // ✅ Succès
        setMessage('✅ Merci pour votre évaluation !');
        setRating(Math.round(data.averageRating));
        setSubmitted(true);
      })
      .catch(err => {
        console.error(err);
        setMessage('❌ Une erreur est survenue.');
      });
  };

  return (
    <div>
      <p>Évaluer ce livre :</p>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            cursor: submitted ? 'default' : 'pointer',
            color: star <= rating ? 'gold' : 'gray',
            fontSize: '1.5rem',
            marginRight: '4px',
          }}
          onClick={() => !submitted && handleRate(star)}
        >
          ★
        </span>
      ))}
      {message && <p style={{ marginTop: '10px', color: '#333' }}>{message}</p>}
    </div>
  );
};

export default RatingStars;
