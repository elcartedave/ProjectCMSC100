import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Filter from './Filter.js';

function ProductList() {
    const [product, setProduct] = useState([]);
    const [tokenData, settokenData] = useState([]);
    const [filtered, setFilter] = useState('all');
    let ProductL = [...product];

    const fProductList = () =>{
        return ProductL.sort((a,b) => {
            if(filtered === 'name'){
                let first = a.productName.toLowerCase();
                let second = b.productName.toLowerCase();
                if(first < second){
                    return -1;
                }else if(first > second){
                    return 1;
                }else{
                    return 0;
                }
            }else if(filtered === 'type'){
                let first = a.productType;
                let second = b.productType;
                if(first < second){
                    return -1;
                }else if(first > second){
                    return 1;
                }else{
                    return 0;
                }
            }else if(filtered === 'price'){
                let first = parseInt(a.productPrice);
                let second = parseInt(b.productPrice);
                if(first < second){
                    return -1;
                }else if(first > second){
                    return 1;
                }else{
                    return 0;
                }
            }else if(filtered === 'quantity'){
                let first = parseInt(a.productQuantity);
                let second = parseInt(b.productQuantity);
                if(first < second){
                    return -1;
                }else if(first > second){
                    return 1;
                }else{
                    return 0;
                }
            }else{
                return ProductL;
            }
        });
    }
        
    

    useEffect(() => {
        axios.get('http://localhost:3001/productlist')
            .then((response) => {
                setProduct(response.data);
                console.log(response);
            });
            const token = localStorage.getItem('token');
            axios.post('http://localhost:3001/token',{token})
            .then((response) => {
                settokenData(response.data.tokenData)
                console.log(response);
            });
    }, []);

    function FonChangeVS(fValue){
        setFilter(fValue);

    }

    function CheckTokenPushCart(tokened, productid){
        axios.post('http://localhost:3001/shoppingcart', {productIDs:productid, userIDs:tokened.userId, quantity:1})
        .then((response) => {
            console.log(response);
        })
    }

    return (
        <>
        <div className='row'>
            <Filter FonChangeSelect={FonChangeVS}></Filter>
        </div>
        <div className="container mt-5">
                <div className="row">
                    {fProductList().map((prod) => {
                        return (
                            <div className="col-md-4 mb-4" key={prod._id}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{prod.productName}</h5>
                                        <br/>
                                        <h6 className="card-subtitle mb-2 text-muted">Type: {prod.productType}</h6>
                                        <p className="card-text">Price: ₱{prod.productPrice}</p>
                                        <p className="card-text">Description: {prod.productDescription}</p>
                                        <p className="card-text">Quantity: {prod.productQuantity}</p>
                                        <button className="btn btn-primary" onClick={() => CheckTokenPushCart(tokenData,prod._id)}>Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default ProductList;