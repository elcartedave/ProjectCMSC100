import React, { useEffect } from "react"; // Import React library and useEffect hook
import "./CSS/Modal.css"; // Import the CSS file for styling the Modal component

const Modal = ({ message, show, handleClose, time }) => {
  // Modal component definition, taking four props:
  // message: The message to display in the modal
  // show: A boolean indicating whether the modal should be visible
  // handleClose: A function to close the modal
  // time: The time in milliseconds after which the modal should auto-close

  useEffect(() => {
    if (show) {
      // If 'show' is true (modal is visible)
      const timer = setTimeout(() => {
        // Set a timeout to automatically close the modal after 'time' milliseconds
        handleClose(); // Call the handleClose function to close the modal
      }, time);
      return () => clearTimeout(timer); // Cleanup: Clear the timeout if dependencies change or component unmounts
    }
  }, [show, handleClose]); // Dependencies: Only run the effect if 'show' or 'handleClose' change

  return (
    // Render the modal
    <div className={`notification ${show ? "show" : ""}`}> 
      {/* Add 'show' class to the div if 'show' is true to make the modal visible */}
      {message} {/* Display the message */}
    </div>
  );
};

export default Modal; // Export the Modal component for use in other parts of the application
