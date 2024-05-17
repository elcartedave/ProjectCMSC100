import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

  function ShoppingCart() {
    const [tokenData, setTokenData] = useState(null);
    const [summaryData, setSummaryData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post('http://localhost:3001/token', { token })
                .then((response) => {
                    const tokenData = response.data.tokenData;
                    setTokenData(tokenData);
                    const userId = tokenData.userId;

            axios.post('http://localhost:3001/shopping-cart',{userId})
                .then((response) => {
                    setSummaryData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching shopping cart:", error);
                });
                })
                .catch((error) => {
                    console.error("Token verification error:", error);
                });
        }
    }, []);

  return (
      <div className="container mt-4">
          <h2>Shopping Cart</h2>
          {summaryData.map(item => (
              <div className="card mb-3" key={item._id}>
                  <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                          <h5 className="card-title">{item.productName}</h5>
                      </div>
                      <div>
                          <p className="card-text">Quantity: {item.quantity}</p>
                      </div>
                      <div>
                          <p className="card-text">Total Price: P{item.totalPrice}</p>
                      </div>
                  </div>
              </div>
          ))}
      </div>
  );
}

export default ShoppingCart;