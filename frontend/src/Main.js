import './App.css';
import { Fragment } from "react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from "./components/Header";
import Contents from "./components/Contents";
import Fotter from "./components/Footer";

const Main = () => {
  return (
    <div>
      <Header />
        {/* <Contents /> */}
        <Footer />
    </div>
  );
};

export default Main;