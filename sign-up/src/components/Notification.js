import React, { useEffect, useState } from "react"; // Import React library and hooks
import "./CSS/Notification.css"; // Import the CSS file for styling the Notification component

const Notification = ({ message }) => {
  // Notification component definition, taking 'message' as a prop
  const [visible, setVisible] = useState(false); // State to control the visibility of the notification
  const [displayMessage, setDisplayMessage] = useState(""); // State to hold the message to be displayed

  useEffect(() => {
    if (message) {
      // If 'message' prop is not empty
      setDisplayMessage(message); // Set the message to be displayed
      setVisible(true); // Make the notification visible

      const timer = setTimeout(() => {
        // Set a timeout to hide the notification after 900 milliseconds
        setVisible(false); // Hide the notification
      }, 900); // Display duration

      return () => clearTimeout(timer); // Cleanup: Clear the timeout if dependencies change or component unmounts
    }
  }, [message]); // Dependencies: Only run the effect if 'message' changes

  useEffect(() => {
    if (!visible) {
      // If the notification is not visible
      const clearMessageTimer = setTimeout(() => {
        // Set a timeout to clear the displayed message after 500 milliseconds
        setDisplayMessage(""); // Clear the message
      }, 500); // Small delay to allow the fade-out animation

      return () => clearTimeout(clearMessageTimer); // Cleanup: Clear the timeout if dependencies change or component unmounts
    }
  }, [visible]); // Dependencies: Only run the effect if 'visible' changes

  return (
    // Render the notification
    <div className={`notification ${visible ? "show" : "hide"}`}>
      {/* Add 'show' class to the div if 'visible' is true to make the notification visible */}
      {displayMessage} {/* Display the message */}
    </div>
  );
};

export default Notification; // Export the Notification component for use in other parts of the application
