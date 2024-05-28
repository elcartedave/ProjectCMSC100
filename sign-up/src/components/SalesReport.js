import axios from "axios";
import React, { useEffect, useState } from "react";

const SalesReport = () => {
  const [salesReport, setSalesReport] = useState([]);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalSalesQuantity, setTotalSalesQuantity] = useState(0);
  const [timePeriod, setTimePeriod] = useState("allTime");//show the instance as all time as it is initialize

  useEffect(() => {
    fetchSalesReport();
  }, [timePeriod]);//render the data on which time period the admin wants

  const fetchSalesReport = async () => {
    try {
      const { startDate, endDate } = getDateRange(timePeriod);
      const response = await axios.get("http://localhost:3001/salesreport", {
        params: { startDate, endDate },
      });//sends the starting date and end date
      setSalesReport(response.data);
      calculateTotals(response.data);//calc total sales of a certain product then total it
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
    }
  };

  const getDateRange = (period) => {
    // Create a new Date object representing the current date and time
    const now = new Date();
    let startDate, endDate;
  
    // Determine the start and end date based on the specified period
    switch (period) {
      case "weekly":
        // Set startDate to the first day of the current week (Sunday)
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        // Set endDate to the last day of the current week (Saturday)
        endDate = new Date(now.setDate(now.getDate() + 6 - now.getDay()));
        break;
      case "monthly":
        // Set startDate to the first day of the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        // Set endDate to the last day of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "yearly":
        // Set startDate to the first day of the current year
        startDate = new Date(now.getFullYear(), 0, 1);
        // Set endDate to the last day of the current year
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        // If no valid period is provided, set startDate and endDate to null
        startDate = null;
        endDate = null;
        break;
    }
  
    // Return the start and end dates in ISO string format
    return {
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };
  };
  

  const calculateTotals = (report) => {//calculate total by gettung total amount of each item and total quantity sales of each item
    let totalAmount = 0;
    let totalQuantity = 0;
    report.forEach((item) => {
      totalAmount += item.totalSalesAmount;
      totalQuantity += item.totalSalesQuantity;
    });
    setTotalSalesAmount(totalAmount);
    setTotalSalesQuantity(totalQuantity);
  };

  return (
    <div>
      <h1 className="admin-header">SALES REPORT</h1>
      <div>
        <label className="admin-subheader">Select Time Period: </label>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          style={{ padding: "5px", borderRadius: "10px"}}
        >
          <option value="allTime">All Time</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="yearly">This Year</option>
        </select>
      </div>
      {salesReport.length === 0 ? (
        <h1 className="pending-header">No Sales Yet!</h1>
      ) : (
        <>
          <div className="ordernumber-field">
            <div className="ordernumber-card">
              <h2 className="order-title">Total Number of Sales: {totalSalesQuantity}</h2>
            </div>
            <div className="ordernumber-card">
            <h2 className="order-title">Total Sales Amount: Php {totalSalesAmount}</h2>
            </div>
          </div>
          <table className="user-field">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Total Sales Quantity</th>
                <th>Total Sales Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((item) => (
                <tr key={item.productID}>
                  <td>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      style={{ width: "50px", height: "50px", margin: "10px 15px"}}
                    />
                  </td>
                  <td className="order-name">{item.productName}</td>
                  <td className="order-description">{item.totalSalesQuantity}</td>
                  <td className="order-price">Php {item.totalSalesAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default SalesReport;
