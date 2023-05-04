import React,{useState, useEffect, useRef} from 'react';
import { Container, Row, Col, Button,Table, Modal } from 'react-bootstrap';
import {BsPlus, BsTrashFill,BsFillPencilFill, BsEye} from 'react-icons/bs';
import { Link } from "react-router-dom";

import { db } from './config/firebaseConfig';
import {collection, getDocs } from 'firebase/firestore';

import Card from 'react-bootstrap/Card';

export default function Contact() {


  // useEffect(() => {
  //   test();
  // }, []);

  // const test = async () => {
  //   let dataCost = [];

  //   try{
  //     const querySnapshot = await getDocs(collection(db, "cost"));
  //     querySnapshot.forEach((doc) => {
  //         dataCost.push(doc.data());
  //       }
  //     );
  //       //ordenar por fecha
  //     dataCost.sort((a, b) => {
  //       if(a.fecha < b.fecha) return 1;
  //       if(a.fecha > b.fecha) return -1;
  //       return 0;
  //     });
  //   }catch(err){
  //     console.log(err);
  //   }
  // };

  return (
    <>
    {/* <Modal
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

    </Modal> */}
    
    <div className="p-2 vh-100"
      style={{ backgroundColor: "#EEECEC" }}
    >
      <Container >
        <Row className="align-content-start">
          <Col className="d-flex flex-row justify-content-between align-items-start bg-white py-2 rounded shadow ">
            <p
              className="my-auto  fs-4"
            ><strong>Muy pronto Estadisticas</strong></p>
            
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
}


