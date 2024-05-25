import React, { useEffect, useState } from "react";
import "./CSS/Notification.css";

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 900); // Display duration

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (!visible) {
      const clearMessageTimer = setTimeout(() => {
        setDisplayMessage("");
      }, 500); // Small delay to allow the fade-out animation

      return () => clearTimeout(clearMessageTimer);
    }
  }, [visible]);

  return (
    <div className={`notification ${visible ? "show" : "hide"}`}>
      {displayMessage}
    </div>
  );
};

export default Notification;
