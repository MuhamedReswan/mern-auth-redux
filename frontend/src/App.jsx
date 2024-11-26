// import React from 'react'
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header.jsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="h-screen">
        <Header />
        <ToastContainer/>
        <Container className="flex justify-center items-center my-2 bg-gray-600">
          <Outlet />
        </Container>
    </div>
  );
};

export default App;
