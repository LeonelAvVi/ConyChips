import React,{useState, useEffect, useRef} from 'react';
import { Container, Row, Col, Button,Table, Modal } from 'react-bootstrap';
import {BsPlus, BsTrashFill,BsFillPencilFill, BsEye} from 'react-icons/bs';
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

// import { db, storage } from './config/firebaseConfig';
import { db } from './config/firebaseConfig';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {collection, getDocs ,addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';


import Card from 'react-bootstrap/Card';

export default function Contact() {
  const [showModal , setShowModal] = React.useState(false)
  const [products, setProducts] = useState([]);
  const [typeModal, setTypeModal] = useState("create");
  const [idProduct, setIdProduct] = useState({});
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const storage = getStorage();

  useEffect(() => {
    getProducts();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const getProducts = async () => {
    let dataProduct = [];

    try{
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc) => {
        dataProduct.push({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
          cost : doc.data().cost,
        });
        }
      );
        //ordenar por fecha
        dataProduct.sort((a, b) => {
        if(a.name < b.name) return 1;
        if(a.name > b.name) return -1;
        return 0;
      });
      

      setProducts(dataProduct);

    }catch(err){
      console.log(err);
    }
  };

  const submitImage = async (data) => {
    let urlImage = "";
    const  imageRef = ref(storage, 'images/'+image.name);
    //como subir la imagen
    const metadata = {
      contentType: 'image/jpeg'
    };

    const uploadTask = uploadBytesResumable(imageRef, image, metadata);
    await uploadTask.on('state_changed',
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          const docRef = doc(db, "products", data.id);
          urlImage = downloadURL;
          updateDoc(docRef, {
            name: data.name,
            cost: data.cost,
            image: urlImage,
          });
          setMessage("Producto actualizado correctamente");
          setLoading(false);
        });
      }
    );
    
    return urlImage;
  };

  const handleUpdateProduct = async () => {
    let nameUpdate ="";
    let costUpdate = "";
    let imageUpdate = "";
    if (name === "") {
      nameUpdate = idProduct.name;
    }else{
      nameUpdate = name;
    }
    if (cost === "") {
      costUpdate = idProduct.cost;
    }else{
      costUpdate = cost;
    }
    if (image === null) {
      imageUpdate = idProduct.image;
      const docRef = doc(db, "products", idProduct.id);
      await updateDoc(docRef, {
        name: nameUpdate,
        cost: costUpdate,
        image: imageUpdate,
      });
      setMessage("Producto actualizado correctamente");
    }else{
      let data = {
        id: idProduct.id,
        name: nameUpdate,
        cost: costUpdate,
      };
      await submitImage(data);

    }
    
  } 


  const handleImageUpload = async () => {
    let url = "";
    setLoading(true);
    
    if(image === null) {
      setMessage("Debe seleccionar una imagen");
      return;
    }
    if(name === "") {
      setMessage("Debe ingresar un nombre");
      return;
    }
    if(cost === "") {
      setMessage("Debe ingresar un costo");
      return;
    }
    setLoading(true);

    const  mountainsRef = ref(storage, 'images/'+image.name);
    //como subir la imagen
    const metadata = {
      contentType: 'image/jpeg'
    };

    const uploadTask = uploadBytesResumable(mountainsRef, image, metadata);
    await uploadTask.on('state_changed',
      (snapshot) => {
        // progreso de la subida
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            setMessage("Subida de datos pausada");
          break;
          case 'running':
            setMessage("Subiendo datos"); 
          break;
          case 'success':
            setMessage("Subida de datos completada");
          break;
          default:
            setMessage("Subida de datos");
          break;
        }
      },
      (error) => {
        // error de la subida
        switch (error.code) {
          case 'storage/unauthorized':
            setMessage("No tiene permisos para subir archivos");
            break;
          case 'storage/canceled':
            setMessage("Subida de datos cancelada");
            break;
          case 'storage/unknown':
            setMessage("Error desconocido");
            break;
          default:
            setMessage("Error desconocido");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          url = downloadURL;
          try {
            let data = {
              name: name,
              image: url,
              cost: cost,
            };
            addDoc(collection(db, "products"), data);
            setMessage("Producto creado correctamente");
            setShowModal(false);
          } catch (err) {
            
          }
        });
      }
    );

    
  };
  
  const handleDeleteProduct = async () => {
    const docRef = doc(db, "products", idProduct.id);
    await deleteDoc(docRef);
    setMessage("Producto eliminado correctamente");
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
          {typeModal === "create"&& "Nuevo Producto"}
          {typeModal === "edit"&& "Editar Producto"}
          {typeModal === "view"&& "Ver Producto"}
          {typeModal === "delete"&& "Eliminar Producto"}
        </Modal.Title>
      </Modal.Header>
      {
        typeModal === "create"&&
        <Modal.Body>
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" id="name" name="name" placeholder="Nombre" onChange={(e)=>setName(e.target.value)}  />
          <label className="form-label">Costo</label>
          <input type="number" className="form-control" id="cost" name="cost" placeholder="Costo" onChange={(e)=>setCost(e.target.value)} />
          <label className="form-label">Imagen</label>
          <input type="file" className="form-control" id="image" name="image" placeholder="Imagen"  onChange={handleImageChange} />
          <div className="text-danger">{message}</div>
        </Modal.Body>
      }
      {
        typeModal === "edit"&&

        <Modal.Body>
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" id="name" name="name" onChange={(e)=>setName(e.target.value)} placeholder={idProduct.name} />
          <label className="form-label">Costo</label>
          <input type="number" className="form-control" id="cost" name="cost" placeholder={idProduct.cost} onChange={(e)=>setCost(e.target.value)} />
          <label className="form-label">Imagen</label>
          <input type="file" className="form-control" id="image" name="image" placeholder="Imagen"  onChange={handleImageChange} />
          <div className="text-danger">{message}</div>
        </Modal.Body>
        
      }
      {
        typeModal === "delete"&&
        <Modal.Body>
          <p>Desea eliminar el producto {idProduct.name}</p>
          <div className="text-success">{message}</div>
        </Modal.Body>
      }

      <Modal.Footer>
        <Button variant="secondary"
          onClick={() => setShowModal(false)}
        >Cerrar</Button>
        {
          typeModal === "create"&&<Button variant="primary" onClick={()=>{
            handleImageUpload();
            setMessage("");
          }} >Crear</Button>
        }
        {
          typeModal === "edit"&&
            <Button variant="primary" onClick={()=>{
              handleUpdateProduct();
              setMessage("");
            }} >Actualizar</Button>
        }
        {
          typeModal === "delete"&&
            <Button variant="danger" onClick={()=>{
              handleDeleteProduct();
              setMessage("");
            }} >Eliminar</Button>
        }
      </Modal.Footer>
      

    </Modal>
    
    <div className="p-2 vh-100"
      style={{ backgroundColor: "#EEECEC" }}
    >
      <Container >
        <Row className="align-content-start">
          <Col className="d-flex flex-row justify-content-between align-items-start bg-white py-2 rounded shadow ">
            <p
              className="my-auto  fs-4"
            ><strong>Productos</strong></p>
            <Button className="bg-warning fw-bold px-3 py-1 rounded shadow"
              style={{ textDecoration: "none", color: "black" }}
              to="/newCost"
              onClick={() => {setShowModal(true);setTypeModal("create"); setIdProduct("") }}
            >
              <BsPlus className="fw-bold  fs-3 m-auto"/>  
              Nuevo
            </Button>
          </Col>
        </Row>

        <Row className="align-content-start d-flex flex-row justify-content-between align-items-start bg-white py-2 rounded shadow mt-3 pb-5"
          style={{height: "80vh", overflowY: "scroll"}}
        >
            {
              products?.map((product, index) => (
              <Col className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-2">
                <Card
                  bg={"secondary"}
                  text={"Secondary".toLowerCase() === 'light' ? 'dark' : 'white'}
                  className="mb-2"
                  key={index}
                >
                  <Card.Header
                    bg={"dark"}
                    className="text-center fw-bold m-1 d-flex flex-row justify-content-between align-items-center bg-dark"
                  >
                    {product.name}
                    <div>
                      <BsTrashFill 
                        className="mx-1 text-danger"
                        
                        size={20}
                        onClick={() => {setShowModal(true);setTypeModal("delete"); setIdProduct({
                          id:product.id,
                          name:product.name,
                          cost:product.cost,
                          image:product.image,
                        }) }}
                      />
                      <BsFillPencilFill 
                        className="mx-1 text-primary"
                        size={20}
                        onClick={() => {setShowModal(true);setTypeModal("edit"); setIdProduct({
                          id:product.id,
                          name:product.name,
                          cost:product.cost,
                          image:product.image,
                        }) }}
                      />
                    </div>
                  </Card.Header>
                  <Card.Body>
                  <Card.Img variant="top" 
                    src= {product.image}
                    style={{
                      width: "100%",
                      maxHeight: "100px",
                      objectFit: "cover",
                    }}
                  />
                    <Card.Title
                      className="text-center my-2"
                    >
                      Precio Bs: {product.cost}
                    </Card.Title>
                    <Card.Text>
                      
                    </Card.Text>
                  </Card.Body>
                </Card>
                   </Col>
              ))
            }
       
        </Row>
        
      </Container>
    </div>
    </>
  );
}


