import React from 'react';
import './userPage.css';
import { useEffect, useState } from 'react';
import axios from 'axios';



const UserPage = ({ handleLogout }) => {

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedSeatsPlatinum, setSelectedSeatsPlatinum] = useState([]);
    const [selectedSeatsGold, setSelectedSeatsGold] = useState([]);
    const [selectedSeatsSilver, setSelectedSeatsSilver] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');

    const handleLogoutClick = () => {
        localStorage.removeItem('TicketBookingToken');
        handleLogout();
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                },
            };
            const response = await axios.get('http://localhost:8080/movies/all', config);
            if (response.status === 200) {
                setMovies(response.data.allData);
            } else {
                console.log(response.data)
            }

        } catch (error) {
            console.error('Error fetching movies:', error.message);
        }
    };

    const handleBookTickets = async (movieId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                },
            };
            const response = await axios.get(`http://localhost:8080/movies/single/${movieId}`, config);
            if (response.status === 200) {
                setSelectedMovie(response.data.movieData);
                console.log(response.data.movieData)
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error fetching movie data:', error.message);
        }
    };


    const handleAddToCart = () => {
        if (
            selectedSeatsPlatinum.length === 0 &&
            selectedSeatsGold.length === 0 &&
            selectedSeatsSilver.length === 0
        ) {
            alert('Please select at least one seat.');
            return;
        }

        const cartData = {
            platiniumTickets: selectedSeatsPlatinum,
            goldTickets: selectedSeatsGold,
            silverTickets: selectedSeatsSilver,
        };

        // Make POST request to add seats to cart
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
            }
        };
        const movieId = selectedMovie._id;
        const url = `http://localhost:8080/tickets/cart/add/${movieId}`;
        axios
            .post(url, cartData, config)
            .then((response) => {
                setSelectedSeatsPlatinum([]);
                setSelectedSeatsGold([]);
                setSelectedSeatsSilver([]);
                alert(response.data.message);
                handleBookTickets(movieId)
            })
            .catch((error) => {
                alert("Server Error")
                console.error('Error adding seats to cart:', error.message);
            });
    };

    const handleSeatClick = (section, seatId, isBooked) => {
        if (isBooked) {
            alert("Seat is already booked.")
        } else {
            switch (section) {
                case 'platinum':
                    setSelectedSeatsPlatinum((prevSeats) => {
                        if (prevSeats.includes(seatId)) {
                            return prevSeats.filter((seat) => seat !== seatId);
                        } else {
                            return [...prevSeats, seatId];
                        }
                    });
                    break;
                case 'gold':
                    setSelectedSeatsGold((prevSeats) => {
                        if (prevSeats.includes(seatId)) {
                            return prevSeats.filter((seat) => seat !== seatId);
                        } else {
                            return [...prevSeats, seatId];
                        }
                    });
                    break;
                case 'silver':
                    setSelectedSeatsSilver((prevSeats) => {
                        if (prevSeats.includes(seatId)) {
                            return prevSeats.filter((seat) => seat !== seatId);
                        } else {
                            return [...prevSeats, seatId];
                        }
                    });
                    break;
                default:
                    break;
            }
        }

    };

    const handleBookSeats = () => {
        if (
            selectedSeatsPlatinum.length === 0 &&
            selectedSeatsGold.length === 0 &&
            selectedSeatsSilver.length === 0
        ) {
            alert('Please select at least one seat.');
            return;
        }

        const bookingData = {
            totalPlatiniumTickets: selectedSeatsPlatinum,
            totalGoldTickets: selectedSeatsGold,
            totalSilverTickets: selectedSeatsSilver,
        };
        console.log(bookingData)
        // Make POST request to book seats
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
            }
        };
        const movieId = selectedMovie._id;
        const url = `http://localhost:8080/tickets/book/movie/${movieId}`;
        axios.post(url, bookingData, config)
            .then((response) => {
                setSelectedSeatsPlatinum([]);
                setSelectedSeatsGold([]);
                setSelectedSeatsSilver([]);
                alert(response.data.message);
                handleBookTickets(movieId)
            })

            .catch((error) => {
                alert("Server Error")
                console.error('Error booking seats:', error.message);
            });
    };

    const handleCartClick = async () => {
        setCurrentPage('cart');
        fetchCartItems();
    };

    const handleHomeClick = () => {
        setCurrentPage('home');
        setSelectedMovie(null);
      };

    const fetchCartItems = async () => {
        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                }
            };
            const response = await axios.get('http://localhost:8080/tickets/cart/all/items', config);
            if (response.status === 201) {
                // console.log(response.data.data)
                setCartItems(response.data.data);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error.message);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleRemoveFromCart = async (movieID) => {
        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                }
            };
          const response = await axios.delete(`http://localhost:8080/tickets/cart/remove/item/${movieID}`,config);
          if (response.status === 200) {
           alert(response.data.message)
           fetchCartItems()
          } else {
            alert(response.data.message)
            console.log(response.data);
          }
        } catch (error) {
          alert("Server Error")
          console.error('Error removing item from cart:', error.message);
        }
      };
    
      const handleConfirmBooking = async (movieID, platiniumTickets, goldTickets, silverTickets) => {
        try {
          const data = {
            totalPlatiniumTickets: platiniumTickets,
            totalGoldTickets: goldTickets,
            totalSilverTickets: silverTickets,
          };
          let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
            }
        };
          const response = await axios.post(`http://localhost:8080/tickets/book/movie/${movieID}`, data, config);
          if (response.status === 200) {
            alert(response.data.message)
            handleRemoveFromCart(movieID)
          } else if(response.status===400){
            alert(response.data.message)
            console.log(response.data);
          }
        } catch (error) {
            alert(error.response.data.message)
          console.error('Error confirming booking:', error.message);
        }
      };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar__logo">MovieTickets</div>
                <div className="navbar__options">
                    <ul>
                        <li onClick={handleHomeClick}>Home</li>
                        <li onClick={handleCartClick}>Cart</li>
                        <li>About</li>
                        <li onClick={handleLogoutClick}>Logout</li>
                    </ul>
                </div>
            </nav>
            <h2 className="user-head">User Page</h2>
            {currentPage === "home" && (
                <div>
                    {selectedMovie ? (
                        <div className="movie-details">
                            <h2>{selectedMovie.movieName}</h2>
                            <div className="seat-layout">
                                <div className="seat-section">
                                    <h3>Platinum Seats</h3>
                                    {Array.from({ length: selectedMovie.totalPlatiniumTickets }, (_, index) => {
                                        const seatId = `p${index + 1}`;
                                        const isBooked = selectedMovie.bookedPlatiniumSeats.includes(seatId);
                                        const isSelected = selectedSeatsPlatinum.includes(seatId);
                                        const seatClass = isBooked ? 'seat platinum-seat booked' : 'seat platinum-seat';
                                        if (isSelected) {
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={`${seatClass} selected-platinum`}
                                                    onClick={() => handleSeatClick('platinum', seatId, isBooked)}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={seatClass}
                                                    onClick={() => handleSeatClick('platinum', seatId, isBooked)}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className="seat-section">
                                    <h3>Gold Seats</h3>
                                    {Array.from({ length: selectedMovie.totalGoldTickets }, (_, index) => {
                                        const seatId = `g${index + 1}`;
                                        const isBooked = selectedMovie.bookedGoldSeats.includes(seatId);
                                        const isSelected = selectedSeatsGold.includes(seatId);
                                        const seatClass = isBooked ? 'seat gold-seat booked' : 'seat gold-seat';
                                        if (isSelected) {
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={`${seatClass} selected-gold`}
                                                    onClick={() => handleSeatClick('gold', seatId, isBooked)}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={seatClass}
                                                    onClick={() => handleSeatClick('gold', seatId, isBooked)}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className="seat-section">
                                    <h3>Silver Seats</h3>
                                    {Array.from({ length: selectedMovie.totalSilverTickets }, (_, index) => {
                                        const seatId = `s${index + 1}`;
                                        const isBooked = selectedMovie.bookedSilverSeats.includes(seatId);
                                        const isSelected = selectedSeatsSilver.includes(seatId);
                                        const seatClass = isBooked ? 'seat silver-seat booked' : 'seat silver-seat';
                                        if (isSelected) {
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={`${seatClass} selected-silver`}
                                                    onClick={() => handleSeatClick('silver', seatId, isBooked)}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={seatClass}
                                                    onClick={() => handleSeatClick('silver', seatId, isBooked)}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <button onClick={handleAddToCart}>Add to Cart</button>
                            <button onClick={handleBookSeats}>Book Seats</button>
                        </div>
                    ) : (
                        <div className="movie-cards">
                            {movies
                                .filter((movie) => movie.openForSale)
                                .map((movie) => (
                                    <div key={movie._id} className="movie-card">
                                        <h3>Movie: {movie.movieName}</h3>
                                        <p>Total Tickets: {movie.totalTickets}</p>
                                        <p>
                                            <b>Remaining Tickets:</b>
                                        </p>
                                        <p>For Platinum: {movie.remainingPlatinumTickets}</p>
                                        <p>For Gold: {movie.remainingGoldTickets}</p>
                                        <p>For Silver: {movie.remainingSilverTickets}</p>
                                        <p>Closing Date: {movie.closingDate}</p>
                                        <button onClick={() => handleBookTickets(movie._id)}>Book Tickets</button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}

{currentPage === 'cart' && (
        <div>
          <h2>Cart</h2>
          {cartItems.length === 0 ? (
            <p>No tickets selected in the cart.</p>
          ) : (
            cartItems.map((item) => (
               
              <div key={item.movieID} className="cart-item">
                <h3>Movie: {item.movieName}</h3>
                <p>
                  Platinum Tickets:{' '}
                  {item.platiniumTickets.length === 0 ? 'Ticket Not Selected' : item.platiniumTickets.join(', ')}
                </p>
                <p>
                  Gold Tickets: {item.goldTickets.length === 0 ? 'Ticket Not Selected' : item.goldTickets.join(', ')}
                </p>
                <p>
                  Silver Tickets:{' '}
                  {item.silverTickets.length === 0 ? 'Ticket Not Selected' : item.silverTickets.join(', ')}
                </p>
                <button onClick={() => handleConfirmBooking(item.movieID, item.platiniumTickets, item.goldTickets, item.silverTickets)}>Confirm Booking</button>
                <button onClick={() => handleRemoveFromCart(item.movieID)}>Remove from Cart</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    );
};

export default UserPage;
