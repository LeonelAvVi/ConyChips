import React,{useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { FaBeer } from "@react-icons/all-files/fa/FaBeer";
import { db } from './config/firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { BsFillPersonFill } from 'react-icons/bs';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { Container, Row, Col } from 'react-bootstrap';

function CardProduct(props) {
  const { name, price, stock } = props;
  return (
    <div className="col-md-6 col-6 text-light text-center align-self-center my-2">
    <div className="mt-2 rounded border border-2 border-warning position-relative"
    style={{ 
      backgroundImage: `url("https://i.pinimg.com/originals/8c/3c/4a/8c3c4a1f07ce0ba0d25311296b2c94a6.jpg")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'multiply',
      backgroundColor: 'rgba(0,0,0,0.8)',
     }}
    >
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill fs-6 py-2 bg-dark border border-2 border-warning">
        {stock}
      </span>
      <p
        className='my-auto display-1 fw-bold font-we-bold font-weight-bold text-warning py-3'
      >{price} <span 
      className='text-white fs-3'
      >Bs</span></p>
      <p className="text-dark fw-bold bg-warning p-2 my-0">{name}</p>
    </div>
  </div>
  );
}

function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    console.log('db');
    try{
      console.log("hola");
      const querySnapshot = await getDocs(collection(db, "products"));
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      }
      );
    }catch(err){
      console.log(err);
    }
  };

  return (

        <Col className="bg-dark text-light text-center align-self-center p-2"
        style={{ height: "100vh" }}
        >
          <div className="d-flex flex-row justify-content-around w-full my-2">
            <p className='my-auto fs-1 font-we-bold font-weight-bold text-warning'>Total Bs:<span className='text-white'> 50</span></p>
            <Button variant="warning">
              <BsFillPersonFill /> Vender
            </Button>
          </div>
          <div class="container">
            <div class="row">
              <CardProduct name="Producto 1" price="18" stock="10" />
              <CardProduct name="Producto 2" price="20" stock="20" />
              <CardProduct name="Producto 3" price="15" stock="30" />
            </div>
          </div>
        </Col>

  );
}

export default App;
