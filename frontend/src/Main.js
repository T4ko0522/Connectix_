import './App.css';
import { Fragment } from "react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from "./components/Header";
import Contents from "./components/Contents";

const Main = () => {
  return (
    <div>
      <Header />
        {/* <Contents /> */}
    </div>
  );
};

export default Main;