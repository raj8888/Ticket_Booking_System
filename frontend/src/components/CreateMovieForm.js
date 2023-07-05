import React, { useState } from 'react';
import axios from 'axios';

const CreateMovieForm = () => {
  const [movieData, setMovieData] = useState({
    movieName: '',
    totalTickets: 0,
    totalPlatiniumTickets: 0,
    totalGoldTickets: 0,
    totalSilverTickets: 0,
    closingDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('TicketBookingToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response=await axios.post('http://localhost:8080/movies/create', movieData, config);
      // Reset the form after successful submission
      if(response.status===201){
        setMovieData({
            movieName: '',
            totalTickets: 0,
            totalPlatiniumTickets: 0,
            totalGoldTickets: 0,
            totalSilverTickets: 0,
            closingDate: '',
          });
          alert(response.data.message)
      }else{
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Error creating movie:', error);
    }
  };

  return (
    <div>
      <h3 className="createmovie-head">Create Movie</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="movieName">Movie Name:</label>
        <input type="text" id="movieName" name="movieName" value={movieData.movieName} onChange={handleChange} />

        <label htmlFor="totalTickets">Total Tickets:</label>
        <input type="number" id="totalTickets" name="totalTickets" value={movieData.totalTickets} onChange={handleChange} />

        <label htmlFor="totalPlatiniumTickets">Total Platinum Tickets:</label>
        <input type="number" id="totalPlatiniumTickets" name="totalPlatiniumTickets" value={movieData.totalPlatiniumTickets} onChange={handleChange} />

        <label htmlFor="totalGoldTickets">Total Gold Tickets:</label>
        <input type="number" id="totalGoldTickets" name="totalGoldTickets" value={movieData.totalGoldTickets} onChange={handleChange} />

        <label htmlFor="totalSilverTickets">Total Silver Tickets:</label>
        <input type="number" id="totalSilverTickets" name="totalSilverTickets" value={movieData.totalSilverTickets} onChange={handleChange} />

        <label htmlFor="closingDate">Closing Date:</label>
        <input type="date" id="closingDate" name="closingDate" value={movieData.closingDate} onChange={handleChange} />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateMovieForm;
