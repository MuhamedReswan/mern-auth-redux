// import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";

const App = () => {
  return (
    <>
      <div className="bg-yellow-500">
        <Header />
        <Outlet />
      </div>
    </>
  );
};

export default App;
