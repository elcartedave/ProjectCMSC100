import React, { useEffect } from "react";

const Filter = (props) => {
  function FonChange(event) {
    props.FonChangeSelect(event.target.value);
  }//when botton is selected this change the value that is passed on the dashboard and productlist

  function FonChange1(event) {
    props.FonChangeSelect1(event.target.value);
  }//same as filter

  useEffect(() => {
    function handleSortClick(event) {
      const sortoptions = document.querySelectorAll(".sort-btn");
      sortoptions.forEach((option) => {
        if (option !== event.target) {
          option.classList.remove("clicked");
        }
      });
      event.target.classList.toggle("clicked");
    }//put in the use effect so every click it updated which event was selected

    function handleOrderClick(event) {
      const orderoptions = document.querySelectorAll(".order-btn");
      orderoptions.forEach((option) => {
        if (option !== event.target) {
          option.classList.remove("clicked");
        }
      });
      event.target.classList.toggle("clicked");
    }//which button is click 

    const sortButtons = document.querySelectorAll(".sort-btn");
    sortButtons.forEach((button) => {
      button.addEventListener("click", handleSortClick);
    });//add a event listener for all with className sort btn

    const orderButtons = document.querySelectorAll(".order-btn");
    orderButtons.forEach((button) => {
      button.addEventListener("click", handleOrderClick);
    });//add a event listener for all with className order btn

    return () => {
      sortButtons.forEach((button) => {
        button.removeEventListener("click", handleSortClick);
      });//name, price, type, quantity
      orderButtons.forEach((button) => {
        button.removeEventListener("click", handleOrderClick);
      });//for sorting asc or desc
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
