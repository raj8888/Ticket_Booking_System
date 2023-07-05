import React from 'react';

const CartItems = ({ cartItems }) => {
  return (
    <div className="cart-items">
      {cartItems.map((item) => (
        <div key={item.movieID} className="cart-item">
          <h3>Movie: {item.movieName}</h3>
          <p>Platinum Tickets: {item.platinumTickets.join(', ')}</p>
          <p>Gold Tickets: {item.goldTickets.join(', ')}</p>
          <p>Silver Tickets: {item.silverTickets.join(', ')}</p>
          {/* Add any other desired cart item information */}
        </div>
      ))}
    </div>
  );
};

export default CartItems;
