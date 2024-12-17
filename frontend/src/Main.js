import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './pages/Sign_in';
import SignUp from './pages/Sign_up';
import './App.css';

const Main = () => {
  const location = useLocation();

  // HeaderとFooterを非表示にする関数
  const noHeaderFooterRoutes = ['/sign-in', '/sign-up'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div
      style={{
        background: '#1e202c', // 背景色を変更
        minHeight: '100vh', // コンテンツが少ない場合でも背景色がページ全体に適用されるように
      }}
    >
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
