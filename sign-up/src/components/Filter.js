import React, { useEffect } from "react";

const Filter = (props) => {
  function FonChange(event) {
    props.FonChangeSelect(event.target.value);
  }

  function FonChange1(event) {
    props.FonChangeSelect1(event.target.value);
  }

  useEffect(() => {
    function handleSortClick(event) {
      const sortoptions = document.querySelectorAll(".sort-btn");
      sortoptions.forEach((option) => {
        if (option !== event.target) {
          option.classList.remove("clicked");
        }
      });
      event.target.classList.toggle("clicked");
    }

    function handleOrderClick(event) {
      const orderoptions = document.querySelectorAll(".order-btn");
      orderoptions.forEach((option) => {
        if (option !== event.target) {
          option.classList.remove("clicked");
        }
      });
      event.target.classList.toggle("clicked");
    }

    const sortButtons = document.querySelectorAll(".sort-btn");
    sortButtons.forEach((button) => {
      button.addEventListener("click", handleSortClick);
    });

    const orderButtons = document.querySelectorAll(".order-btn");
    orderButtons.forEach((button) => {
      button.addEventListener("click", handleOrderClick);
    });

    return () => {
      sortButtons.forEach((button) => {
        button.removeEventListener("click", handleSortClick);
      });
      orderButtons.forEach((button) => {
        button.removeEventListener("click", handleOrderClick);
      });
    };
  }, []);

  return (
    <>
<div className="sort-container">
  <div className="drop-down">
    <p className="sort-title">SORT BY:</p>
    <div className="asc-desc">
      <button className="order-btn" value="ascending" onClick={FonChange1}>
        ASC
      </button>
      <button className="order-btn" value="descending" onClick={FonChange1}>
        DESC
      </button>
    </div>
    
    <button className="sort-btn" value="name" onClick={FonChange}>
      Name
    </button>
    <button className="sort-btn" value="type" onClick={FonChange}>
      Type
    </button>
    <button className="sort-btn" value="price" onClick={FonChange}>
      Price
    </button>
    <button className="sort-btn" value="quantity" onClick={FonChange}>
      Quantity
    </button>
  </div>
</div>


    </>
  );
};

export default Filter;
