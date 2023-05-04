import {NavLink, redirect, Outlet, useLocation  } from 'react-router-dom';
import { getContacts , createContact} from '../contacts';
import { Container, Row, Modal } from 'react-bootstrap';
import {FaMoneyBillAlt, FaCashRegister } from 'react-icons/fa';
import {HiOutlineClipboardList} from 'react-icons/hi';
import {BiBarChartSquare} from 'react-icons/bi';
import {BsCartFill, BsPersonCircle, BsFillBagFill, BsFillBox2Fill, BsFillClipboardCheckFill,BsFillClipboardDataFill} from 'react-icons/bs';

import React from 'react';

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
  }

export async function loader() {
    const contacts = await getContacts();
    return {contacts};
}

export default function Root() {
  const [login, setLogin] = React.useState(true);
  const [showModal , setShowModal] = React.useState(false);
  const [user , setUser] = React.useState("");

  const location = useLocation();
  
    return (
      <>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Body>
            <h4 className="text-center">Iniciar Sesión</h4>
            <input type="text" className="form-control" placeholder="Usuario" 
              onChange={(e) => setUser(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={() => {
              if (user === "123456"){
                setLogin(true);
                setShowModal(false);
              }
              else
                alert("Usuario incorrecto");
            }}>
              Iniciar
            </button>
            <button className="btn btn-danger" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </Modal.Footer>
        </Modal>


        <div id="sidebar"
          className="d-flex flex-column justify-content-between align-content-start"
          style={{ height: "100vh" }}
        >
          <Container fluid>
            <Row className="vh-100 align-content-start" id="detail">
              <Outlet />
            </Row>
          </Container>
          {/* <div>
              
          </div> */}

          {
            login ? (
              <nav
                id="contacts"
                className="bg-warning rounded-top fixed-bottom pt-2"
              >
                <ul
                  className="d-flex flex-row justify-content-around align-items-center"
                  style={{ listStyle: "none",
                  padding: "0",
                }}

                >
                  <li >
                      <NavLink
                        to={`/Product`}
                        className={``}
                      >
                        <BsFillBox2Fill
                        color = {`${location.pathname === "/Product" ? "black":"white" }`}
                        size={32}
                        />
                      </NavLink>
                    </li>
                    <li >
                      <NavLink
                        to={`contacts/`}
                        style={{ textDecoration: "none" }}
                        className={({ isActive, isPending }) =>
                          isActive
                            ? "active"
                            : isPending
                            ? "pending"
                            : ""
                        }
                      >
                        <BsFillClipboardCheckFill 
                        color = {`${location.pathname === "/contacts/" ? "black":"white" }`}
                          size={32}
                        />
                      </NavLink>
                    </li>

                    <li 
                      className={`
                      ${location.pathname === "/" ? "bg-black":  "bg-white" }
                      rounded-circle p-4 border border-4 border-warning`}
                      style={{
                        marginTop: "-40px",
                      }}
                    >
                      <NavLink
                        to={`/`}
                        className={({ isActive, isPending }) =>
                          isActive
                            ? "active"
                            : isPending
                            ? "pending"
                            : ""
                          
                        }
                        
                      >
                        <BsCartFill
                        className={`${location.pathname === "/" ? "text-warning":"text-secondary" }`}
                        // color = "black"
                        size={40}
                        />
                      </NavLink>
                    </li>

                    <li >
                      <NavLink
                        to={`/sale`}
                        className={``}
                      >
                        <BsFillBagFill
                        color = {`${location.pathname === "/sale" ? "black":"white" }`}
                        size={32}
                        />
                      </NavLink>
                    </li>

                    <li >
                      <NavLink
                        to={`/statistics`}
                        className={``}
                      >
                        <BsFillClipboardDataFill
                        color = {`${location.pathname === "/statistics" ? "black":"white" }`}
                        size={32}
                        />
                      </NavLink>
                    </li>
                </ul>
              </nav>
              )
              :
              (
                <div
                className="d-flex flex-column justify-content-center align-items-center  fixed-bottom p-2"
                >
                  <BsPersonCircle
                    color = "white"
                    size={32}
                    onClick={() => setShowModal(true)}
                    className='mx-auto d-block'
                  />
                  <p
                    className='mx-auto d-block p-2'
                    style={{
                      color: "white",
                      zIndex: "10000",
                      fontSize: "8px",
                      margin : "auto"
                    }}
                  >v.1.1.0</p>
                </div>
                
              )
          }
        </div>
        
      </>
    );
  }