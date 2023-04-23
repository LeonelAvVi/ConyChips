import {NavLink, redirect, Form, useLoaderData, Link, Outlet } from 'react-router-dom';
import { getContacts , createContact} from '../contacts';
import { Container, Row, Col } from 'react-bootstrap';
import {BsFillClipboard2MinusFill, BsCartFill, BsBagFill} from 'react-icons/bs';

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
  }

export async function loader() {
    const contacts = await getContacts();
    return {contacts};
}

export default function Root() {
    const { contacts } = useLoaderData();
    return (
      <>
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
          <nav
            id="contacts"
            className="bg-warning rounded-top fixed-bottom"
          >
            <ul
              className="d-flex flex-row justify-content-around align-items-center"
              style={{ listStyle: "none",
              padding: "0",
            }}

            >
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
                    <BsFillClipboard2MinusFill
                    color = "white"
                      size={32}
                    />
                  </NavLink>
                </li>

                <li 
                  className='bg-white rounded-circle p-4 border border-4 border-warning'
                  style={{
                    marginTop: "-40px",
                  }}
                >
                   <NavLink
                    to={`contacts/`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                      
                    }
                    
                  >
                    <BsCartFill
                    className='text-black '
                    // color = "black"
                    size={40}
                    />
                  </NavLink>
                </li>

                <li >
                   <NavLink
                    to={`contacts/`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    <BsBagFill
                    color = "white"
                    size={32}
                    />
                  </NavLink>
                </li>
            </ul>
          </nav>
        </div>
        
      </>
    );
  }