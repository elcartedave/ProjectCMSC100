import React, { useEffect } from 'react';

const Filter = (props) => {
  function FonChange(event) {
    props.FonChangeSelect(event.target.value);
  }

  useEffect(() => {
    function handleClick(event) {
      const sortoptions = document.querySelectorAll('.sort-btn');
      
      sortoptions.forEach(option => {
        if (option !== event.target) {
          option.classList.remove('clicked');
        }
      });

      event.target.classList.toggle('clicked');
    }

    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(button => {
      button.addEventListener('click', handleClick);
    });

    // Cleanup event listeners on component unmount
    return () => {
      sortButtons.forEach(button => {
        button.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <div className="drop-down">
      <p className="sort-title">SORT BY:</p>
      <button className="sort-btn" value="all" onClick={FonChange}>
        All
      </button>
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
  );
};

export default Filter;
