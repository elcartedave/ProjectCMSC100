import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SignUp from './SignUp.js';
import UserList from './UserList.js'
import ProductList from './ProductList.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const router = createBrowserRouter([
  { path: '/sign-up', element: <SignUp />},
  { path: '/user-list', element: <UserList />},
  { path: '/product-list', element: <ProductList />}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />    
  </React.StrictMode>
);


