import React from 'react';
import './PaymentForm.css';

const PaymentForm = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cvv,
  setCvv,
  paymentAmount,
  setPaymentAmount,
  handleSubmit,
}) => {
  return (
    <div className="payment-form-container">
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardNumber" className='paymentLabel'>Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className='paymentIP'
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardName" className='paymentLabel'>Card Name:</label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className='paymentIP'
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv" className='paymentLabel'>CVV:</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className='paymentIP'
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentAmount" className='paymentLabel'>Payment Amount:</label>
          <input
            type="number"
            id="paymentAmount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
            className='paymentIP'
          />
        </div>
        <button type="submit" className='paymentBtn'>Submit</button>
      </form>
    </div>
  );
};

export default PaymentForm;
