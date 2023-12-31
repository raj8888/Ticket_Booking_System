import React from 'react';
import './userPage.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import mainAPI from './DeployedLink';
import PaymentForm from './PaymentForm';


const UserPage = ({ handleLogout }) => {

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedSeatsPlatinum, setSelectedSeatsPlatinum] = useState([]);
    const [selectedSeatsGold, setSelectedSeatsGold] = useState([]);
    const [selectedSeatsSilver, setSelectedSeatsSilver] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOrder, setFilterOrder] = useState('ascending');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cvv, setCvv] = useState('');
  
    // State to track the payment amount
    const [paymentAmount, setPaymentAmount] = useState(0);

    // If user click on logout, he will redirect to login page
    const handleLogoutClick = () => {
        localStorage.removeItem('TicketBookingToken');
        handleLogout();
    };

    useEffect(() => {
        fetchMovies();
    }, []);


    // fetch all movies to render on home
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
                alert(response.data.message)
            }

        } catch (error) {
            alert("Server Error")
            console.error('Error fetching movies:', error.message);
        }
    };

    // handelling the ticket booking
    const handleBookTickets = async (movieId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                },
            };
            const response = await axios.get(`${mainAPI}/movies/single/${movieId}`, config);
            if (response.status === 200) {
                setSelectedMovie(response.data.movieData);
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            alert("Server Error")
            console.error('Error fetching movie data:', error.message);
        }
    };


    // If user select some seats then and click on add to cart buttion then tickets for that seats addedt to the cart.
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
            console.log(cartData)
        // Make POST request to add seats to cart
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
            }
        };
        const movieId = selectedMovie._id;
        const url = `${mainAPI}/tickets/cart/add/${movieId}`;
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

    // If user click on booked seats then if will show alert message else seats will be selected.
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
        // Calculate the total price based on selected seats
        const platinumTicketPrice = 1000;
        const goldTicketPrice = 600;
        const silverTicketPrice = 400;
        const totalPrice =
          selectedSeatsPlatinum.length * platinumTicketPrice +
          selectedSeatsGold.length * goldTicketPrice +
          selectedSeatsSilver.length * silverTicketPrice;
    
        setPaymentAmount(totalPrice);
    
        setCurrentPage('payment');
    };

    const handleCartClick = async () => {
        setCurrentPage('cart');
        fetchCartItems();
        setSearchQuery('');
    };

    const handleHomeClick = () => {
        setCurrentPage('home');
        setSelectedMovie(null);
        setSearchQuery('');
        fetchMovies()
    };

    // Fetching Items in cart for that particular user.
    const fetchCartItems = async () => {
        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                }
            };
            const response = await axios.get(`${mainAPI}/tickets/cart/all/items`, config);
            if (response.status === 201) {
                setCartItems(response.data.data);
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            alert("Server Error")
            console.error('Error fetching cart items:', error.message);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // If user click on remove button then this tickets are removed from then cart.
    const handleRemoveFromCart = async (movieID) => {
        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                }
            };
            const response = await axios.delete(`${mainAPI}/tickets/cart/remove/item/${movieID}`, config);
            if (response.status === 200) {
                alert(response.data.message)
                fetchCartItems()
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            alert("Server Error")
            console.error('Error removing item from cart:', error.message);
        }
    };

    // This will make request to backend to check selected seats available or not.
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
            const response = await axios.post(`${mainAPI}/tickets/book/movie/${movieID}`, data, config);
            if (response.status === 200) {
                alert(response.data.message)
                handleRemoveFromCart(movieID)
            } else if (response.status === 400) {
                alert(response.data.message)
            }
        } catch (error) {
            alert(error.response.data.message)
            console.error('Error confirming booking:', error.message);
        }
    };

    //user can search movie name
    const handleSearch = async () => {
        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                }
            };
            const response = await axios.post(`${mainAPI}/tickets/search/movies`, { searchQuery }, config);
            if (response.status === 201) {
                // Update the movies state with the search results
                setMovies(response.data.data);
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            alert("Server Error")
            console.error('Error searching movies:', error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilterOrder(e.target.value);
    };

    // user can filter movies in ascending of descending order
    const handleFilter = async () => {
        let filterURL = `${mainAPI}/tickets/filter/movies/`;

        if (filterOrder === 'ascending') {
            filterURL += 'ascending';
        } else if (filterOrder === 'descending') {
            filterURL += 'descending';
        }

        try {
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
                }
            };
            const response = await axios.get(filterURL, config);
            if (response.status === 201) {
                // Update the movies state with the search results
                setMovies(response.data.data);
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            alert("Server Error")
            console.error('Error searching movies:', error.message);
        }
    };


    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
      
        // Perform payment validation and processing here
      
        // Validate card number, card name, CVV, and payment field
        if (!cardNumber || !cardName || !cvv ) {
          alert('Please fill in all payment details');
          return;
        }
      
        // Perform additional payment validation and processing as needed
        // ...
      
        // Check if the payment amount matches the total price
        const platinumTicketPrice = 1000;
        const goldTicketPrice = 600;
        const silverTicketPrice = 400;
        const totalPlatinumPrice = selectedSeatsPlatinum.length * platinumTicketPrice;
        const totalGoldPrice = selectedSeatsGold.length * goldTicketPrice;
        const totalSilverPrice = selectedSeatsSilver.length * silverTicketPrice;
        const totalPrice = totalPlatinumPrice + totalGoldPrice + totalSilverPrice 
        console.log(paymentAmount,totalPrice)
        if (paymentAmount !== totalPrice) {
          alert('Invalid payment amount');
          return;
        }
      
        // Make the request to book the seats
        try {
          const bookingData = {
            totalPlatiniumTickets: selectedSeatsPlatinum,
            totalGoldTickets: selectedSeatsGold,
            totalSilverTickets: selectedSeatsSilver,
          };
      
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('TicketBookingToken')}`,
            },
          };
      
          const movieId = selectedMovie._id;
          const url = `${mainAPI}/tickets/book/movie/${movieId}`;
      
          const response = await axios.post(url, bookingData, config);
          if (response.status === 200) {
            setSelectedSeatsPlatinum([]);
            setSelectedSeatsGold([]);
            setSelectedSeatsSilver([]);
            setCardName("")
            setCardNumber("")
            setCvv("")
            setPaymentAmount(0)
            alert(response.data.message);
            handleBookTickets(movieId);
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          alert('Server Error');
          console.error('Error booking seats:', error.message);
        }
      
        setCurrentPage('home'); // Redirect to the home page after booking seats
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
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search movies"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={handleSearch} className="search-button">Search</button>
                    </div>
                    <div className="filter-select">
                        <select id="filter" value={filterOrder} onChange={handleFilterChange} className="select-field">
                            <option value="ascending" className="select-field-option">Ascending</option>
                            <option value="descending" className="select-field-option">Descending</option>
                        </select>
                        <button onClick={handleFilter} className="filter-button">Apply</button>
                    </div>
                    {selectedMovie ? (
                        <div className="movie-details">
                            <h2 className="movie-name">{selectedMovie.movieName}</h2>
                                    <div className="section-name">
                                    <h3 className='plt-head'>Platinum Seats</h3>
                                    <h3 className='gld-head'>Gold Seats</h3>
                                    <h3 className='slvr-head'>Silver Seats</h3>
                                    </div>
                            <div className="seat-layout">
                                <div className="seat-section">
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
                                    {/* <h3>Gold Seats</h3> */}
                                <div className="seat-section">
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
                                    {/* <h3>Silver Seats</h3> */}
                                <div className="seat-section">
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
                            <button onClick={handleAddToCart} className='add-to-cart-button'>Add to Cart</button>
                            <button onClick={handleBookSeats} className='book-button'>Book Seats</button>
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
                                <button onClick={() => handleConfirmBooking(item.movieID, item.platiniumTickets, item.goldTickets, item.silverTickets)} className='confirm-booking-button'>Confirm Booking</button>
                                <button onClick={() => handleRemoveFromCart(item.movieID)} className='remove-from-cart-button'>Remove from Cart</button>
                            </div>
                        ))
                    )}
                </div>
            )}
            {currentPage === 'payment' && (
        <PaymentForm
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardName={cardName}
          setCardName={setCardName}
          cvv={cvv}
          setCvv={setCvv}
          handleSubmit={handlePaymentSubmit}
        />
      )}
        </div>
    );
};

export default UserPage;
