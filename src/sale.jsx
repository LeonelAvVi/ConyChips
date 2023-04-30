import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import React,{useState, useEffect} from 'react';
import { Container, Row, Col, Button,Table, Modal } from 'react-bootstrap';
import {BsArrowLeftCircleFill, BsSearch, BsEye} from 'react-icons/bs';

import { db } from './config/firebaseConfig';
import {collection, getDocs } from 'firebase/firestore';

export default function Sale() {
  const [modalShow , setModalShow] = useState(false);
  const [typePanel, setTypePanel] = useState("sale");
  const [data , setData] = useState([])
  const [dataDay , setDataDay] = useState([])
  const [dataProduct , setDataProduct] = useState([])

  const [inputFecha, setInputFecha] = useState("");
  const [inputHora, setInputHora] = useState("");

  const [dataFull , setDataFull] = useState([])
  const [dataFullDay , setDataFullDay] = useState([])

  const [showDay, setShowDay] = useState(false);

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    let dataCost = [];

    try{
      const querySnapshot = await getDocs(collection(db, "sales"));
      querySnapshot.forEach((doc) => {
          dataCost.push(doc.data());
        }
      );
        //ordenar por fecha
      dataCost.sort((a, b) => {
        if(a.dia < b.dia) return 1;
        if(a.dia > b.dia) return -1;
        return 0;
      });
      setData(dataCost);
      setDataFull(dataCost);
      console.log(dataCost);
    }catch(err){
      console.log(err);
    }
  };

  const filterSalesDay = () => {
    setDataDay([]);
    if (inputHora === "") return setDataDay(dataFullDay);
    let dataCost = [];
    dataFullDay.filter((cost) => {
      if(cost.hora.includes(inputHora)){
        dataCost.push(cost);
      }
      return false;
    });
    setDataDay(dataCost);
  }

  const filterSales = () =>{
    setData([]);
    if (inputFecha === "") return setData(dataFull);
    let dataCost = [];
    dataFull.filter((cost) => {
      if(cost.dia.includes(inputFecha)){
        dataCost.push(cost);
      }
      return false;
    });
    setData(dataCost);
  }

  return (
    <>
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Productos Vendidos
        </Modal.Title>
      </Modal.Header>
      <div
        className="p-2"
      >
        <Table striped bordered hover
          style={{ maxHeight: "25vh", overflowY: "auto"}}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              dataProduct.map((product, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{product.name}</td>
                  <td>{product.cantidad}</td>
                  <td>{product.cantidad*product.price}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        <div
          className="d-flex flex-row justify-content-around align-items-center"
        >
          <p className="fw-bold">Total:</p>
          <p className="fw-bold">{
            dataProduct.reduce((a, b) => a + (b['cantidad']*b['price']), 0)
          }</p>
        </div>
      </div>

    </Modal>
    {
      showDay&&(
        <div
        className="p-2 w-100 h-100 rounded shadow fixed-bottom"
        style={{ backgroundColor: "#00000060"}}
      >
        <div
          className="rounded shadow h-100"
        >
          <Container>
            <Row className="align-content-start mt-3 bg-white  rounded shadow "
              style={{ maxHeight: "80vh",minHeight: "80vh"}}
            >
               <Col className="d-flex flex-row justify-content-start align-items-start my-2 py-2 col-6 fw-bold">
                <BsArrowLeftCircleFill
                  className="mx-2 text-primary"
                  size={28}
                  onClick={() => {
                    setShowDay(false);
                  }}
                />
                Buscar :
              </Col>
              <Col className="d-flex flex-row justify-content-between align-items-start py-2 col-6">
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Hora"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onChange={(e) => {
                      setInputHora(e.target.value);
                    }}
                  />
                  <InputGroup.Text id="basic-addon2">
                    <BsSearch 
                      onClick={() => {
                        filterSalesDay();
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col className="d-flex flex-row justify-content-between align-items-start py-2 col-12">
                <div 
                  className="w-100 h-100 rounded"
                  style={{ maxHeight: "65vh",minHeight:"65vh", overflowY: "auto" }}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Hora</th>
                        <th>Venta</th>
                        <th>Deatalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        dataDay.map((item, index) => {
                          return(
                            <tr key={index}>
                              <td className='p-1'>{index+1}</td>
                              <td className='p-1'>{item.hora}</td>
                              <td className='p-1'>{item.total}</td>
                              <td className='p-1'>
                                <Button variant="success"
                                  onClick={() => {
                                    setModalShow(true);
                                    setDataProduct(item.productos);
                                  }}
                                >
                                  <BsEye />
                                </Button>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </div>
              </Col>
              </Row>
            </Container>
        </div>
      </div>
      )
    }
   
    <div className="p-2 vh-100"
      style={{ backgroundColor: "#EEECEC"}}
    >
      <Container >
        <Row className="align-content-start">
          <Col className="d-flex flex-row justify-content-between align-items-start bg-warning text-dark py-2 rounded shadow ">
            <p
              className="my-auto  fs-4"
            ><strong>Control de Ventas</strong></p>
          </Col>
        </Row>
        {
          typePanel === "sale" ?
            <Row className="align-content-start mt-3 bg-white  rounded shadow "
              style={{ maxHeight: "75vh",minHeight: "75vh"}}
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
                    onChange={(e) => {
                        setInputFecha(e.target.value);
                    }}
                  />
                  <InputGroup.Text id="basic-addon2"

                  >
                    <BsSearch
                      onClick={() => {
                        filterSales();
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col className="col-12">
                <div
                style={{maxHeight: "65vh", overflowY: "scroll"}}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Costo</th>
                        <th>Venta</th>
                        <th>Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >22/05/2021</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >100</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >200</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >
                          <Button variant="success" className="py-0 px-1 mx-auto">
                            <BsEye className="fw-bold  fs-5"/>
                          </Button>
                        </td>
                      </tr> */}
                      {
                        data.map((item, index) => {
                          return(
                            <tr key={index}>
                              <td
                                style={{fontSize: "0.8rem"}}
                              >{item.dia}</td>
                              <td
                                style={{fontSize: "0.8rem"}}
                              >{item.costos}</td>
                              <td
                                style={{fontSize: "0.8rem"}}
                              >{item.total}</td>
                              <td
                                style={{fontSize: "0.8rem"}}
                              >
                                <Button variant="success" className="py-0 px-1 mx-auto"
                                  onClick={() =>{setShowDay(true); setDataDay(item.data);setDataFullDay(item.data)}}
                                >
                                  <BsEye className="fw-bold  fs-5"/>
                                </Button>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  </div>
              </Col>
            </Row>
            :
            <Row className="align-content-start mt-3 bg-white  rounded shadow "
              style={{ maxHeight: "90vh" }}
            >
              <Col className="d-flex flex-row justify-content-between align-items-start my-2 py-2 col-7 fw-bold">
                <Button className="py-0 px-0 mx-auto btn btn-link"
                  onClick={() => setTypePanel("sale")}
                >
                  <BsArrowLeftCircleFill className="fw-bold  fs-5"/>
                </Button>
                Buscar por hora :
              </Col>
              <Col className="d-flex flex-row justify-content-between align-items-start py-2 col-5">
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Fecha"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <InputGroup.Text id="basic-addon2">
                    <BsSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col className="col-12"
              
              >
                <div
                style={{maxHeight: "55%", overflowY: "scroll"}}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Venta</th>
                        <th>Detallesss</th>
                      </tr>
                    </thead>
                    <tbody
                    >
                      <tr>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >18:50</td>
                        
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >200</td>
                        <td 
                          style={{fontSize: "0.8rem"}}
                        >
                          <Button variant="success" className="py-0 px-1 mx-auto"
                          onClick={() => setModalShow(true)}
                          >
                            <BsEye className="fw-bold  fs-5"/>
                          </Button>
                        </td>
                      </tr>
                      
                    </tbody>
                  </Table>
                  </div>
              </Col>
            </Row>
        }
      </Container>
    </div>
    </>
  );
}


