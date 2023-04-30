import React,{useState, useEffect} from 'react';
import './App.css';
import { db } from './config/firebaseConfig';
import { collection, getDocs, addDoc, where as donde, query,deleteDoc} from 'firebase/firestore';
import { BsFillPersonFill,BsX,BsCheck, BsFillXCircleFill,BsCartCheckFill,BsCartXFill} from 'react-icons/bs';

import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Modal, Spinner  } from 'react-bootstrap';

function CardProduct(props) {
  const {id, name, price , image, onSave, cantidadDefault} = props;
  const [show, setShow] = useState(false);
  const [cantidad, setCantidad] = useState(cantidadDefault);
  
  useEffect(() => {
    setCantidad(cantidadDefault);
  }, [cantidadDefault]);

  return (
    <>
      <div
        className={`${
          show ? "position-fixed" : "d-none"
        }
         top-0 bottom-0 left-0 right-0 p-4 h-100 w-100`}
        style={{ 
          zIndex: "1000",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        <Container fluid>
          <Row className="justify-content-center py-4">
            <Col className="text-center p-2 w-full fs-1 justify-items-center">
              <BsFillXCircleFill className='text-warning mx-2 my-auto' size={36} onClick={()=>{setCantidad("")}}/><strong>Cantidad : </strong> <span className="text-warning">{cantidad}</span>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "1")}
              >
                1
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "2")}
              >
                2
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "3")}
              >
                3
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "4")}
              >
                4
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "5")}
              >
                5
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "6")}
              >
                6
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "7")}
              >
                7
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "8")}
              >
                8
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "9")}
              >
                9
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="danger" className="btn-lg rounded-circle fs-1 font-weight-bold border border-warning border-2 p-0"
                onClick={() => {setCantidad("0"); setShow(false)}}
              >
                <BsX
                  size={56}
                />
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="dark" className="btn-lg rounded-circle fs-1 font-weight-bold px-4 py-2 border border-warning border-2"
                onClick={() => setCantidad(cantidad + "0")}
              >
                0
              </Button>
            </Col>
            <Col xs={4} md={4} className="text-center p-2">
              <Button variant="success" className="btn-lg rounded-circle fs-1 font-weight-bold border border-warning border-2 p-0"
                onClick={() => { setShow(false);onSave({
                  id,
                  name,
                  cantidad,
                  price,
                })}}
              >
                <BsCheck
                  size={56}
                />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="col-md-6 col-6 text-light text-center align-self-center my-2"
        onClick={() => {setShow(true)}}
      >
        <div className="mt-2 rounded border border-2 border-warning position-relative"
        style={{ 
          backgroundImage: `url("${image}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'multiply',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}
        >
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill fs-6 py-2 bg-dark border border-2 border-warning">
            {cantidad}
          </span>
          <p className='my-auto display-1 fw-bold font-we-bold font-weight-bold text-warning py-3'>
            {price}
          <span className='text-white fs-3'>Bs</span></p>
          <p className="text-dark fw-bold bg-warning p-2 my-0">{name}</p>
        </div>
      </div>
    </>
  );
}

function App() {

  const [conys, setConys] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [dataConys, setDataConys] = useState([]);

  const [typeModal, setTypeModal] = useState("sale");//sale=> vender, closeday=> cierre de caja


  useEffect(() => {
    test();
  }, []);

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.cantidad;
    });
    setTotal(total);
  }, [cart]);

  const resetValues = () => {
    setCart([]);
    setTotal(0);
    setCantidad("");
    let conys2 = conys;
    setConys([]);
    
  }

  useEffect(() => {
    setConys(dataConys);
  }, [conys]);

  const addCart = (data) => {
    setCart([...cart, data]);
    //console.log(data);
  }

  const vender = async() => {
    setTypeModal("sale");
    setLoading(true);
    setShow(true);
    let fecha = new Date();
    //convertir car a un array de objetos para guardar en firebase
    let cart2 = [];
    cart.forEach((item) => {
      cart2.push({
        name: item.name,
        price: item.price,
        cantidad: item.cantidad,
      });
    });
    
    let data = {
      total,
      dia : fecha.getDate()+"/"+fecha.getMonth()+"/"+fecha.getFullYear(),
      hora : fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds(),
      productos : cart2,
    }
    ///guardar en el firebase 
    try {
      const docRef = await addDoc(collection(db, "ventas_dia"), data);
      resetValues();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }


  const test = async () => {
    let products = [];
    try{
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc) => {
        let product={
          id: doc.id,
          name: doc.data().name,
          price: doc.data().cost,
          image: doc.data().image,
        }
        products.push(product);
      }
      );
      setDataConys(products);
      setConys(products);
    }catch(err){
      console.log(err);
    }
  };

  const closeDay = async () => {
    setTypeModal("closeday");
    setLoading(true);
    //esperar 5 segundos
    
    const querySnapshot = await getDocs(collection(db, "ventas_dia"));
    let data = querySnapshot.docs.map((doc) => doc.data());

    let fecha = new Date();
    let dia = fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear();

    const q = query(collection(db, "cost"), donde("fecha", "==", dia));
    const dataCostos = await getDocs(q);
    let costos = dataCostos.docs.map((doc) => doc.data().monto);
    
    let total = 0;
    data.forEach((item) => {
      total += item.total;
    });

    const docRef = await addDoc(collection(db, "sales"), {
      total,
      dia,
      hora : fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds(),
      costos: costos[0],
      data,
    });
    console.log(total);

    //eliminar los datos de ventas_dia de firebase
    const collectionRef = collection(db, "ventas_dia");
    const dataDelete = await getDocs(collectionRef);
    dataDelete.forEach((doc) => {
      deleteDoc(doc.ref);
    });

    setLoading(false);
    setShow(false);
    alert("Cierre de caja exitoso");
    
  }

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body
          className="bg-dark text-light rounded p-4 d-flex flex-column justify-content-center align-items-center"
        >
          {
            typeModal === "sale" &&
            <>
              <h3>Guardando datos</h3>
              <p>
                {loading ? "Guardando datos..." : "Datos guardados "}
              </p>
              <div>
              {
                loading ? <Spinner animation="border" variant="warning" /> : <Button variant="warning" onClick={() => setShow(false)}>Aceptar</Button>
              }
              </div>
            </>
          }
          {
            
            typeModal === "closeday" &&
            <>
              <h3>Cierre de día</h3>
              <p className='text-center'>
                Esta a punto de cerrar el día, ¿Desea continuar?
              </p>
              <p className='text-center text-danger'>
                Este proceso no se puede deshacer
              </p>
              <div>
                {
                  loading ? <Button variant="warning" disabled
                  className='mx-2'
                  >
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Loading...</span>
                </Button> : <Button variant="warning" className='mx-2' onClick={() => closeDay()}>Aceptar</Button>
                }
                
                <Button variant="danger" className='mx-2'  onClick={() => setShow(false)}>Cancelar</Button>
              </div>
            </>
          }
        </Modal.Body>
      </Modal>

      <Col className="bg-dark text-light text-center align-self-center p-2"
      style={{ height: "100vh" }}
      >
        <div className="d-flex flex-row justify-content-around align-items-center w-full my-2">
          <BsCartXFill className="fs-5 text-whte bg-danger rounded p-2"
            onClick={() => resetValues()}
            size={40}
          />
          <p className='my-auto fs-1 fw-bold font-we-bold font-weight-bold text-warning'>Total Bs: <span className='text-white fw-normal
          '>{total}</span></p>
          <Button variant="success"
            onClick={() => vender()}
            className='my-auto fw-bold font-we-bold font-weight-bold'
          >
            <BsCartCheckFill
              size={24}
            /> Vender
          </Button>
        </div>
        <Container>
          <Row>
            {
              conys.map((cony) => (
                <CardProduct key={cony.id} name={cony.name} price={cony.price} image={cony.image} onSave={(a)=>addCart(a)} cantidadDefault={cantidad}/>
              ))
            }
          </Row>
          <Row
            className="mx-4"
          >
            <Button variant="warning" className="w-100 my-2 m-auto"
            onClick={() => {
              setShow(true);
              setTypeModal("closeday");
            }}
            >
              <BsFillPersonFill /> Cerrar Dia
            </Button>
          </Row>
        </Container>
      </Col>
    </>         
  );
}

export default App;
