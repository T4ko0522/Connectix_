import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignIn from './pages/Sign_in';
import SignUp from './pages/Sign_up';

const Main = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
};

export default Main;
