import './App.css';
import { Fragment } from "react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from "./components/Header";

const Home = () => {
  return (
    <div>
      <Header />
      <Fragment>
        <h1>こ</h1>
        <p>example</p>
      </Fragment>
    </div>
  );
};

export default Home;