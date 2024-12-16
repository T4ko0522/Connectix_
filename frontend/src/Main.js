import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './pages/Sign_in';
import SignUp from './pages/Sign_up';

const Main = () => {
  const location = useLocation();

  // HeaderとFooterを非表示にする関数
  const noHeaderFooterRoutes = ['/sign-in', '/sign-up'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div>
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default Main;