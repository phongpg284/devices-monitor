import "./header.css";
import React from "react";
import {
  Button,
  Form,
  FormControl,
  Image,
  Nav,
  Navbar,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";


const Header: React.FC = () => {
  return (
    <header className="border-bottom">
      <Navbar bg="light" expand="lg" className="p-0 px-2" variant="light">
        <Navbar.Brand href="#home" className="p-0">
          <Image className="header__logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-flex align-items-center">
            <NavLink to="/" className="px-3" style={{fontSize: "1.2rem"}}>Home</NavLink>
            <NavLink to="/devices" className="px-3" style={{fontSize: "1.2rem"}}>Thiết bị</NavLink>
            <NavLink to="/statistics" className="px-3" style={{fontSize: "1.2rem"}}>Dữ liệu</NavLink>
            <NavLink to="/about" className="px-3 mr-3" style={{fontSize: "1.2rem"}}>About</NavLink>
          </Nav>
          <Form inline className="mr-5">
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
