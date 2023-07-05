import React from 'react';

const MovieCard = ({ movie, onBookTickets }) => {
  const handleBookTickets = () => {
    onBookTickets(movie._id);
  };

  return (
    <div className="movie-card">
      <h2>{movie.movieName}</h2>
      <p>Total Tickets: {movie.totalTickets}</p>
      <button onClick={handleBookTickets}>Book Tickets</button>
    </div>
  );
};

export default MovieCard;
