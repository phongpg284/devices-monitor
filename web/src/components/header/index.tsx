import "./header.css";
import React from "react";
import {
  Button,
  Form,
  FormControl,
  Image,
  Nav,
  Navbar,
  NavLink,
} from "react-bootstrap";

const Header: React.FC = () => {
  return (
    <header className="border-bottom">
      <Navbar bg="light" expand="lg" className="p-0 px-2">
        <Navbar.Brand href="#home" className="p-0">
          <Image className="header__logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-flex align-items-center">
            <NavLink className="px-3">Home</NavLink>
            <NavLink className="px-3">Thiết bị</NavLink>
            <NavLink className="px-3">Dữ liệu</NavLink>
            <NavLink className="px-3 mr-3">About</NavLink>
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
