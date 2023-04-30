import React,{useState, useEffect, useRef} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Container, Row, Col, Button,Table, Modal } from 'react-bootstrap';
import {BsPlus, BsSearch, BsEye} from 'react-icons/bs';
import { Link } from "react-router-dom";

import { db } from './config/firebaseConfig';
import {collection, getDocs } from 'firebase/firestore';

export default function Contact() {
  const [showModal , setShowModal] = React.useState(false)
  const [costs, setCosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [nameCost, setNameCost] = useState("");
  const [data , setData] = useState([])

  const fecha = useRef(null);

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    let dataCost = [];

    try{
      const querySnapshot = await getDocs(collection(db, "cost"));
      querySnapshot.forEach((doc) => {
          dataCost.push(doc.data());
        }
      );
        //ordenar por fecha
      dataCost.sort((a, b) => {
        if(a.fecha < b.fecha) return 1;
        if(a.fecha > b.fecha) return -1;
        return 0;
      });
      

      setCosts(dataCost);
      setData(dataCost);
    }catch(err){
      console.log(err);
    }
  };

  const searchCosto = (fecha) => {
    if(fecha === "") return setData(costs);

    let dataCost = [];
    data.filter((cost) => {
      if(cost.fecha === fecha){
        dataCost.push(cost);
      }
    });
    setData(dataCost);
  }


  return (
    <>
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {nameCost?nameCost:""}
        </Modal.Title>
      </Modal.Header>
      <div
        className="p-2"
      >
        <Table striped bordered hover
          style={{fontSize: "0.65rem", overflowY: "auto"}}
        >
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cant</th>
              <th>P. Unit.</th>
              <th>Desc.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              products?.map((product, index) => (
                <tr key={index} >
                  <td className='p-1'>{product.nombre}</td>
                  <td className='p-1'>{product.cantidad}</td>
                  <td className='p-1'>{product.total}</td>
                  <td className='p-1'>{product.descuento}</td>
                  <td className='p-1'>{product.total}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>

    </Modal>
    
    <div className="p-2 vh-100"
      style={{ backgroundColor: "#EEECEC" }}
    >
      <Container >
        <Row className="align-content-start">
          <Col className="d-flex flex-row justify-content-between align-items-start bg-white py-2 rounded shadow ">
            <p
              className="my-auto  fs-4"
            ><strong>Control de Costos</strong></p>
            <Link className="bg-warning fw-bold px-3 py-1 rounded shadow"
              style={{ textDecoration: "none", color: "black" }}
              to="/newCost"
            >
              <BsPlus className="fw-bold  fs-3 m-auto"/>  
              Nuevo
            </Link>
          </Col>
        </Row>
        <Row className="align-content-start mt-3 bg-white  rounded shadow "
          
        >
          <Col className="d-flex flex-row justify-content-between align-items-start my-2 py-2 col-6 fw-bold">
            Buscar Registro :
          </Col>
          <Col className="d-flex flex-row justify-content-between align-items-start py-2 col-6">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Fecha"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                ref={fecha}
              />
              <InputGroup.Text id="basic-addon2"
              >
                <BsSearch 
                  onClick={() => {searchCosto(fecha.current.value)}}
                />
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col className="col-12"
           
          >
            <div
            style={{maxHeight: "65vh", overflowY: "scroll"}}
            >
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Monto Bs:</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody
                >
                  {
                    data?.map((cost, index) => (
                      <tr key={index}>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >{index+1}</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >{
                          cost.fecha
                        }</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >{
                          cost.monto
                        }</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >
                          <Button variant="success" className="py-0 px-1 mx-auto"
                            onClick={() => {
                              setProducts(cost.productos);
                              setNameCost(cost.fecha);
                              setShowModal(true);
                            }}
                          >
                            <BsEye className="fw-bold  fs-5"/>
                          </Button>
                        </td>
                      </tr>
                    ))
                  }
                  
                </tbody>
              </Table>
              </div>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
}


