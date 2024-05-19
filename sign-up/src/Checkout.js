import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Checkout() {
  const [summaryData, setSummaryData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");

  
//   const { userid } = useParams();
//   const [userID, setUserID] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUserID = async () => {
//       const token = localStorage.getItem("cust-token");
//       if (token) {
//         try {
//           axios
//             .post("http://localhost:3001/token", { token })
//             .then((response) => {
//               setUserID(response.data.tokenData.userId);
//             });
//         } catch (error) {
//           console.error("Error fetching userID:", error);
//         }
//       }
//     };

//     fetchUserID();
//   }, []);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (userID === userid) {
//         try {
//           const response = await fetch("http://localhost:3001/userlist");
//           const data = await response.json();
//           const foundUser = data.find((item) => item._id === userID);
//           if (foundUser) {
//             console.log("User found");
//             setUser(foundUser);
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };

//     fetchUser();
//   }, [userID, userid]);

  useEffect(() => {
    const token = localStorage.getItem("cust-token");
    if (token) {
      axios
        .post("http://localhost:3001/token", { token })
        .then((response) => {
          const tokenData = response.data.tokenData;
          const userId = tokenData.userId;

          axios
            .get("http://localhost:3001/shoppingcart", { params: { userId } })
            .then((response) => {
              setSummaryData(response.data);
              let items = 0;
              let price = 0;
              response.data.forEach((item) => {
                items += item.quantity;
                price += item.totalPrice;
              });
              setTotalItems(items);
              setTotalPrice(price);
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(summaryData.length);
        summaryData.forEach(async element => {
            const currentDate = new Date();
            let dateOnly = currentDate.toLocaleDateString();
            let timeOnly = currentDate.toLocaleTimeString();
            console.log();
            let orderData = {
                productID : element._id,
                orderQuantity : element.quantity,
                email : "hello",
                date: new Date(dateOnly),
                time: timeOnly,
            }
            const response = await axios.post('http://localhost:3001/order', orderData);
            console.log(response); 
            if (response && response.data) {
                setError(response.data); 
            } else {
                setError('Response or data is undefined');
            }
          });  
    } catch (error) {
        setError(error);
    }
  };


  return (
    <div className="container mt-4">
      <h2>Checkout Summary</h2>
      {summaryData.map((item) => (
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
      <p>Total Items: {totalItems}</p>
      <p>Total Price: {totalPrice}</p>
      <button className="btn btn-success" onClick={handleSubmit}>Confirm Transaction</button>
    </div>
  );
}

export default Checkout;
