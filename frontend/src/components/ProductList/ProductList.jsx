import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './productList.css';
import Rating from '../Rating/Rating';

export default function ProductList(){
    const [myData, setMyData] = useState([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
    const getProducts = () => {
        axios
      .get('https://dummyjson.com/products')
      .then((res) => {
        setMyData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    }
    useEffect(() =>{
        getProducts();
    },[]);
    const toggleProductExpansion = (productId) => {
        setExpandedProducts((prevExpandedProducts) => ({
          ...prevExpandedProducts,
          [productId]: !prevExpandedProducts[productId],
        }));
      };
      let filteredProducts = [];
  if (myData && myData.products) {
    filteredProducts = myData.products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
    if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
    return (<div className='grid-container'>
        <div>
        <h1> Products List </h1>
        </div>
        
        <div className='search-bar-container'> 
        <input
        type='text'
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder='Search by title...'
        className='search-bar'
      />
      </div>
      <br />
        <ul className='product-grid'> 
            {
                
                filteredProducts.map((product) => {
                    const {price, discountPercentage} = product;
                    const discountedPrice = Math.round(price - (price*discountPercentage)/100);

                    return (
                    
                    <li className='product-item' key={product.id}>
                         <img src = {product.images[0]} alt={product.title} />
                         <br />
                       
                         <div>
                            <div>
                                <Rating rating = {product.rating} />
                            </div>

                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                        <p>Discounted Price: ${discountedPrice}</p>
                        {expandedProducts[product.id] ? (
                <>
                  <p>{product.description}</p>
                  <p>Stock Availibility: {product.stock}</p>
                  <p>Product Category: {product.category}</p>
                  {/* Add more information to show here */}
                  <button className='button' onClick={() => toggleProductExpansion(product.id)}>Show less</button>
                </>
              ) : (
                <button  className ="button"onClick={() => toggleProductExpansion(product.id)}>Show more</button>
              )}
                        </div>
                       
                        </li>
                );
            })
            }
        </ul>
    </div>)
}