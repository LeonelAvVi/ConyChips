import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import React,{useState, useRef,useEffect} from 'react';
import { Container, Row, Col, Button,Table , Modal} from 'react-bootstrap';
import {BsPlus, BsXCircleFill, BsPencil, BsTrash,BsCheckCircleFill} from 'react-icons/bs';
import { collection, addDoc, updateDoc, doc  } from "firebase/firestore";
import { db } from './config/firebaseConfig';
import { Navigate, useLocation  } from "react-router-dom";

export default function UpdateCost(props) {
  const location = useLocation();
  
  

  const [dataCost, setDataCost] = useState();
  const [total , setTotal] = useState(0);
  const [modalType , setModalType] = useState('add');
  const [showModal , setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    nombre: '',
    cantidad: 0,
    precioUnitario: 0,
    total: 0,
    descuento: 0,
  });
  const [load, setLoad] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [indexProduct, setIndexProduct] = useState(0);

  const nameRef = useRef(null);

  const nameUpdateRef = useRef(null);
  const cantidadUpdateRef = useRef(null);
  const precioUnitarioUpdateRef = useRef(null);
  const descuentoUpdateRef = useRef(null);
  const totalUpdateRef = useRef(null);

  const [cantidad, setCantidad] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [totalProducto, setTotalProducto] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const calcularTotal = () => {
      const subTotal = cantidad * precioUnitario;
      const total = subTotal - descuento;
      setTotalProducto(total);
    };

    calcularTotal();
  }, [cantidad, precioUnitario, descuento]);

  useEffect(() => {
    console.log(location);
    if(location.state){
      setDataCost(location.state.cost);
      setProducts(location.state.cost.productos);
    }  
  }, [location]);

  useEffect(() => {
    let newTotal = products.reduce((total, product) => {
      //convertir a numero
      product.total = Number(product.total);
      return total + product.total;
    }, 0);
    setTotal(newTotal);
  }, [products]);

  const handleAddProduct = () => {
    const newProduct = {
      nombre: nameRef.current.value,
      cantidad: Number(cantidad),
      precioUnitario: Number(precioUnitario),
      total: totalProducto,
      descuento: Number(descuento),
    };

    setProducts([...products, newProduct]);
    setTotal(total + totalProducto);
    setCantidad(0);
    setPrecioUnitario(0);
    setDescuento(0);
    setTotalProducto(0);
    nameRef.current.value = '';
  };

  const handleDeleteProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  }

  const handleEditProduct = (index) => {
    setProduct(products[index]);
    setIndexProduct(index);
    setModalType('update');
    setShowModal(true);
  }

  const handleTotalUpdate = () => {
    let cantidad = cantidadUpdateRef.current.value? cantidadUpdateRef.current.value : products[indexProduct].cantidad;
    let precioUnitario = precioUnitarioUpdateRef.current.value? precioUnitarioUpdateRef.current.value : products[indexProduct].precioUnitario;
    let descuento = descuentoUpdateRef.current.value? descuentoUpdateRef.current.value : products[indexProduct].descuento;

    totalUpdateRef.current.value = cantidad * precioUnitario - descuento;
  }

  const handleUpdateProduct = () => {
    let newProducts = [...products];
    newProducts[indexProduct] = {
      nombre: nameUpdateRef.current.value? nameUpdateRef.current.value : products[indexProduct].nombre,
      cantidad:Number( cantidadUpdateRef.current.value? cantidadUpdateRef.current.value : products[indexProduct].cantidad),
      precioUnitario: Number(precioUnitarioUpdateRef.current.value? precioUnitarioUpdateRef.current.value : products[indexProduct].precioUnitario),
      total: Number(totalUpdateRef.current.value? totalUpdateRef.current.value : products[indexProduct].total),
      descuento: Number(descuentoUpdateRef.current.value? descuentoUpdateRef.current.value : products[indexProduct].descuento),
    }
    setProducts(newProducts);
    setShowModal(false);
  }

  const handleSaveProduct = async() => {
    setShowModal(true);
    setModalType('save');
    setLoad(true);
    const data = {
      fecha : new Date().toLocaleDateString(),
      monto : total,
      productos : products
    }

    try {
      const docRef = doc(db, "cost", dataCost.id);
      await updateDoc(docRef, data);
      setLoad(false);
      setError(false);

    } catch (err) {
      setError(true);
      console.log(err);
      setLoad(false);
    }
  }


  return (
    <div className="p-2 vh-100"
      style={{ backgroundColor: "#EEECEC" }}
    >
      <Modal
        show={showModal}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        
        <Modal.Body className="show-grid">
          {
            modalType === 'update' &&  
            <div
              className="d-flex flex-column justify-content-center align-items-center col-12 fw-bold w-100 "
            >
              <h4 className='text-primary'>Actualizar :{indexProduct}</h4>
              <div
                className="d-flex flex-row justify-content-between align-items-center col-6 fw-bold w-100"
              >
                <label className="fw-bold">Nombre: </label>
                <input type="text" className="mx-2 w-full form-control" placeholder={product.nombre} ref={nameUpdateRef}/>
              </div>
              <div
                className="d-flex flex-row justify-content-between align-items-center col-6 fw-bold w-100 mt-2"
              >
                <label className="fw-bold">Cant.: </label> <input type="text" className="mx-2 form-control w-25" placeholder={product.cantidad} ref={cantidadUpdateRef} onChange={()=>{
                  handleTotalUpdate();
                }}/>
                <label className="fw-bold">P. Unitario : </label> <input type="text" className="mx-2 form-control w-25" placeholder={product.precioUnitario} ref={precioUnitarioUpdateRef}
                onChange={()=>{handleTotalUpdate()}}
                />
              </div>
              <div
                className="d-flex flex-row justify-content-between align-items-center col-6 fw-bold w-100 mt-2"
              >
                <label className="fw-bold">Descuento: </label> <input type="text" className="mx-2 form-control w-25" placeholder={product.descuento} ref={descuentoUpdateRef}
                onChange={()=>{handleTotalUpdate()}}
                />
                <label className="fw-bold">Total : </label> <input type="text" className="mx-2 form-control w-25" placeholder={product.total} disabled={true} ref={totalUpdateRef}/>
                
              </div>
              <div
                className="d-flex flex-row justify-content-center align-items-center col-6 fw-bold w-100 mt-4 gap-4"
              >
                <Button variant="outline-danger"
                  onClick={() => setShowModal(false)}
                >
                <BsXCircleFill className='fs-4'/>
                  {'      '}Cancelar</Button>
                <Button variant="primary" className="gap-2"
                  onClick={() => handleUpdateProduct()}
                >
                  <BsPencil className='fs-4 mx-2'/>
                  Actualizar </Button>
              </div>
            </div>
          }

          {
            modalType === 'delete' &&  
            <div
              className="d-flex flex-column justify-content-center align-items-center col-12 fw-bold w-100 "
            >
              <h4 className='text-danger'>Eliminar :</h4>
              <p
                className="my-auto fw-normal fs-5 text-center"
              >
                ¿Esta seguro de eliminar este producto de la lista de Gastos ?
              </p>
              <div
                className="d-flex flex-row justify-content-center align-items-center col-6 fw-bold w-100 mt-4 gap-4"
              >
                <Button variant="outline-danger">
                <BsXCircleFill className='fs-4'/>
                  {'      '}Cancelar</Button>
                <Button variant="danger" className="gap-2" onClick={() => setShowModal(false)}>
                  <BsTrash className='fs-4 mx-2'/>
                  Eliminar </Button>
              </div>
            </div>
          }

          {
            modalType === 'add' &&
            <div
              className="d-flex flex-column justify-content-center align-items-center col-12 fw-bold w-100 "
            >
              <h4 className='text-success'>Guardar Lista de Costos</h4>
              <p
                className="my-auto fw-normal fs-6 text-center"
              >
                Desea guardar la lista de los productos ?  Tenga en cuenta que una ves guardada la informacion no sera posible eliminarla, tampoco modificada. Revise muy bien los campos y toda la informacion
              </p>
              <div
                className="d-flex flex-row justify-content-center align-items-center col-6 fw-bold w-100 mt-4 gap-4"
              >
                <Button variant="outline-danger">
                <BsXCircleFill className='fs-4'/>
                  {'      '}Cancelar</Button>
                <Button variant="success" className="gap-2" onClick={() => setShowModal(false)}>
                  <BsCheckCircleFill className='fs-4 mx-2'/>
                  Eliminar </Button>
              </div>
            </div>
          }

          {
            modalType === 'save' &&
            <div
              className="d-flex flex-column justify-content-center align-items-center col-12 fw-bold w-100 "
            >
              <p
                className="my-auto fw-normal fs-6 text-center"
              >
                {
                   load ? 'Guardando Datos...' : 
                   error ? 'Error al guardar los datos' : 'Datos guardados con exito'
                }

              </p>
              <div
                className="d-flex flex-row justify-content-center align-items-center col-6 fw-bold w-100 mt-4 gap-4"
              >
                <Button variant={load?"secondary":"success"}
                  disabled={load}
                  onClick={() => {
                    if(error===false){
                      setRedirect(true);
                    }
                    setShowModal(false)}}
                >
                  <BsCheckCircleFill className='fs-4'/>
                  {'      '}{load ? 'Guardando...' : 'Aceptar' }
                </Button>
              </div>
            </div>
          }
         
        </Modal.Body>
      </Modal>



      <Container >
        <Row className="align-content-start">
          <Col className="d-flex flex-row justify-content-between align-items-start bg-white py-2 rounded shadow ">
            <div
              className='my-auto'
            >
              <p
                className="my-auto fw-bold"
                style={{fontSize: "0.8rem"}}
              >Total de Costo:</p>
              <p
                className="my-auto fw-bold fs-2"
              >
                Bs : <span className="fw-bold m-0 text-warning">{total}</span>
              </p>
            </div>
            
            <Button variant="success"
              onClick={() => handleSaveProduct()}
            >
              <BsPlus className="fw-bold  fs-3 m-auto"/>  
              Actulizar
            </Button>
          </Col>
        </Row>
        <Row className="align-content-start mt-3  pt-2 bg-white  rounded shadow "
          style={{ maxHeight: "70vh" }}
        >
          <Col className="d-flex flex-row justify-content-between align-items-start mt-1 col-6 fw-bold">
            Fecha Registro : {dataCost?.fecha}
          </Col>
          <Col className="col-12 mt-2">
            <div
              className="d-flex flex-row justify-content-between align-items-center col-6 fw-bold w-100"
            >
              <label className="fw-bold">Nombre: </label>
              <input type="text" className="mx-2 w-full form-control" ref={nameRef}/>
              <Button variant="primary" className="p-2 mx-auto"
                onClick={() => handleAddProduct()}
              >Agregar </Button>
            </div>
          </Col>
          <Col className="col-12 mt-2">
            <div
              className="d-flex flex-row justify-content-between align-items-center col-6 fw-bold w-100"
            >
              <label className="fw-bold">Cant.: </label> 
              <input type="text" 
                className="mx-2 form-control w-25  py-0 px-2 "  
                value={cantidad} onChange={(e) => setCantidad(e.target.value)}
              />
              <label className="fw-bold">P. Unitario : </label> 
              <input type="text" 
                className="mx-2  py-0 px-2  form-control w-25" 
                value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)}
              />
            </div>
          </Col>
          <Col className="col-12 mt-2">
            <div
              className="d-flex flex-row justify-content-between align-items-center col-6 fw-bold w-100"
            >
              <label className="fw-bold">Total : </label> 
              <input disabled={true} type="text" className="mx-2 py-0 px-2 form-control w-25" 
              value={totalProducto}
              />
              <label className="fw-bold">Descuento: </label> 
              <input type="text" className="mx-2 py-0 px-2 form-control w-25" 
                value={descuento} onChange={(e) => setDescuento(e.target.value)} 
              />
            </div>
          </Col>
          <Col className="col-12 my-2"
            style={{ maxHeight: "45vh", overflowY: "auto"}}
          >
            <div>
              <Table striped bordered hover
                style={{fontSize: "0.65rem", maxHeight: "25vh", overflowY: "auto"}}
              >
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cant</th>
                    <th>P. Unit.</th>
                    <th>Desc.</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    products.map((product, index) => (
                    <tr key={index}>
                      <td className='p-1'>{product.nombre}</td>
                      <td className='p-1'>{product.cantidad}</td>
                      <td className='p-1'>{product.precioUnitario}</td>
                      <td className='p-1'>{product.descuento}</td>
                      <td className='p-1'>{product.total}</td>
                      <td className='p-1 px-2'>
                        <Button className="p-0 mx-0 btn btn-link"
                          onClick={() => handleEditProduct(index)}
                        >
                          <BsPencil className="fw-bold  fs-5 m-auto" />
                        </Button>
                        <Button variant="danger" className="p-0 mx-0 mx-1  btn btn-link"
                          onClick={() => handleDeleteProduct(index)}>
                          <BsTrash className="fw-bold fs-5 m-auto text-danger" />
                        </Button>
                      </td>
                    </tr>
                    ))
                  }
                  
                </tbody>
              </Table>
                 {
                    products.length === 0 &&
                    <p className='text-center w-100'>
                    No hay productos agregados
                  </p>
                 }
                  
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    
  );
}


