import React, { useEffect } from "react";

const Filter = (props) => {
  function FonChange(event) {
    props.FonChangeSelect(event.target.value);
  }

  function FonChange1(event) {
    props.FonChangeSelect1(event.target.value);
  }

  useEffect(() => {
    function handleClick(event) {
      const sortoptions = document.querySelectorAll(".sort-btn");

      sortoptions.forEach((option) => {
        if (option !== event.target) {
          option.classList.remove("clicked");
        }
      });

      event.target.classList.toggle("clicked");
    }

    const sortButtons = document.querySelectorAll(".sort-btn");
    sortButtons.forEach((button) => {
      button.addEventListener("click", handleClick);
    });

    // Cleanup event listeners on component unmount
    return () => {
      sortButtons.forEach((button) => {
        button.removeEventListener("click", handleClick);
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
