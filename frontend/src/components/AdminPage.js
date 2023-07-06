import './adminPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateMovieForm from './CreateMovieForm';
import mainAPI from './DeployedLink';


const AdminPage = ({ handleLogout }) => {
  const [movies, setMovies] = useState([]);
  const [showCreateMovieForm, setShowCreateMovieForm] = useState(false);

  // Fetch all movies
  useEffect(() => {
    fetchMovies();
  }, []);

  // logout from admin side
  const handleLogoutClick = () => {
    // Clear token from session storage
    localStorage.removeItem('TicketBookingToken');
    handleLogout();
  };

  // get all movies to render on home page
  const fetchMovies = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
        },
      };
      const response = await axios.get(`${mainAPI}/movies/all`, config);
      if (response.status === 200) {
        setMovies(response.data.allData);
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      alert("Server Error");
      console.error('Error fetching movies:', error.message);
    }
  };

  //Change the stauts of movie if admin close ticket selling then user not able to see this tickets
  let handleStatusChange = async (movieID) => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
        }
      };
      console.log(movieID)
      let response = await axios.patch(`${mainAPI}/movies/update/status/${movieID}`, null, config);
      if (response.status === 201) {
        alert(response.data.message)
        // Fetch updated movie data after status change
        fetchMovies();
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      alert("Server Error");
      console.log(error, error.message)
    }
  };

  const handleNavOptionClick = (option) => {
    setShowCreateMovieForm(option === 'create');
    fetchMovies()
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar__logo">MovieTickets</div>
        <div className="navbar__options">
          <ul>
            <li onClick={() => handleNavOptionClick('home')} >Home</li>
            <li onClick={() => handleNavOptionClick('create')}> Create Movie</li>
            <li>About</li>
            <li onClick={handleLogoutClick}>Logout</li>
          </ul>
        </div>
      </nav>
      <h2 className="admin-head">Admin Page</h2>
      {showCreateMovieForm ? (
        <CreateMovieForm fetchMovies={fetchMovies} />
      ) : (<div className="movie-cards">
        {movies
          .filter((movie) => movie.openForSale) // Filter movies with openForSale true
          .map((movie) => (
            <div key={movie._id} className="movie-card">
              <h3>Movie:{movie.movieName}</h3>
              <p>Total Tickets: {movie.totalTickets}</p>
              <p>Platinium Tickets: {movie.totalPlatiniumTickets}</p>
              <p>Gold Tickets: {movie.totalGoldTickets}</p>
              <p>Silver Tickets: {movie.totalSilverTickets}</p>
              <p>Closing Date:{movie.closingDate}</p>
              <button onClick={() => handleStatusChange(movie._id)}>
                {movie.openForSale ? 'Close Sale' : 'Open Sale'}
              </button>
            </div>
          ))}
      </div>
      )}
    </div>
  );
};

export default AdminPage;