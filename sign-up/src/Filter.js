let Filter = (props) =>{
    function FonChange(event){
        props.FonChangeSelect(event.target.value);
    }

    return(
        <div className="drop-down">
            <p>Sort by</p>
            <button className="nav-btn" value="all" onClick={FonChange}>All</button>
                <button className="nav-btn" value="name" onClick={FonChange}>Name</button>
                <button className="nav-btn" value="type" onClick={FonChange}>Type</button>
                <button className="nav-btn" value="price" onClick={FonChange}>Price</button>
                <button className="nav-btn" value="quantity" onClick={FonChange}>Quantity</button>
        </div>
    );
}



export default Filter;