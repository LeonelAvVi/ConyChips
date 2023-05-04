import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewCost from './newCost';
import Sale from './sale';
import Product from './product';
import Statistics from './statistics';
import UpdateCost from './updateCost';

import Root, {loader as rootLoader, action as rootAction,} from './routes/root';
import ErrorPage from './error-page';
import Contact from './contact';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement : <ErrorPage/>,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "contacts/",
        element: <Contact />,
      },
      {
        path: "/newCost",
        element: <NewCost/>,
      },
      {
        path: "/updateCost",
        element: <UpdateCost/>,
      },
      {
        path: "/sale",
        element: <Sale/>,
      },
      {
        path: "/product",
        element: <Product/>,
      },
      {
        path: "/statistics",
        element: <Statistics/>,
      },
    ],
    
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
