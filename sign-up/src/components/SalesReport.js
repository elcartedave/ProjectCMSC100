import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import chroma from 'chroma-js';
import 'chartjs-plugin-datalabels';
import "./CSS/SalesReport.css";


ChartJS.register(ArcElement, Tooltip, Legend);

const SalesReport = () => {
  const [salesReport, setSalesReport] = useState([]);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalSalesQuantity, setTotalSalesQuantity] = useState(0);
  const [timePeriod, setTimePeriod] = useState("allTime");

  useEffect(() => {
    fetchSalesReport();
  }, [timePeriod]);

  const fetchSalesReport = async () => {
    try {
      const { startDate, endDate } = getDateRange(timePeriod);
      const response = await axios.get("http://localhost:3001/salesreport", {
        params: { startDate, endDate },
      });
      setSalesReport(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
    }
  };

  const getDateRange = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case "weekly":
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        endDate = new Date(now.setDate(now.getDate() + 6 - now.getDay()));
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    return {
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };
  };

  const calculateTotals = (report) => {
    let totalAmount = 0;
    let totalQuantity = 0;
    report.forEach((item) => {
      totalAmount += item.totalSalesAmount;
      totalQuantity += item.totalSalesQuantity;
    });
    setTotalSalesAmount(totalAmount);
    setTotalSalesQuantity(totalQuantity);
  };

  const chartProductQuantity = {
    labels: salesReport.map(item => item.productName),
    datasets: [
      {
        label: 'Total Sales Quantity',
        data: salesReport.map(item => item.totalSalesQuantity),
        labels: salesReport.map(item => item.productName),
        backgroundColor: chroma.scale(['#1e4f2a', '#56ce74']).colors(salesReport.length),
        borderWidth: 5,
      },
    ],
  };

  const chartProductAmount = {
    labels: salesReport.map(item => item.productName),
    datasets: [
      {
        label: 'Total Sales Amout',
        data: salesReport.map(item => item.totalSalesAmount),
        labels: salesReport.map(item => item.productName),
        backgroundColor: chroma.scale(['#1e4f2a', '#56ce74']).colors(salesReport.length),
        borderWidth: 5,
      },
    ],
  };

  return (
    <div>
      <h1 className="admin-header">SALES REPORT</h1>
      <div>
        <label className="admin-subheader">Select Time Period: </label>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          style={{ padding: "5px", borderRadius: "10px" }}
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
          <div className="sales-chart">
            <div className="chart-container">
              <h2 className="sales-highlight">Total Number of Sales: {totalSalesQuantity} </h2>
              <Pie className="pie-chart" data={chartProductQuantity}/> 
            </div>
            <div className="chart-container">
              <h2 className="sales-highlight">Total Sales Amount: Php {totalSalesAmount}</h2>
              <Pie className="pie-chart" data={chartProductAmount} />
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
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "10px 15px",
                      }}
                    />
                  </td>
                  <td className="order-name">{item.productName}</td>
                  <td className="order-description">
                    {item.totalSalesQuantity}
                  </td>
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
