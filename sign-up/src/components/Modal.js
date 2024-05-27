import React, { useEffect } from "react";
import "./CSS/Modal.css";

const Modal = ({ message, show, handleClose, time }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        handleClose();
      }, time);
      return () => clearTimeout(timer);
    }
  }, [show, handleClose]);

  return <div className={`notification ${show ? "show" : ""}`}>{message}</div>;
};

export default Modal;
