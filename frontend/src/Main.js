import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './pages/Sign_in';
import SignUp from './pages/Sign_up';
import AnimatedAlert from './shared/AnimatedAlert'; // AnimatedAlert をインポート
import './App.css';

const Main = () => {
  const location = useLocation();

  // アラートの状態を管理
  const [alert, setAlert] = useState({
    show: false,
    severity: '', // 'success', 'error', 'info', 'warning'
    title: '',
    message: '',
  });

  // アラートを表示する関数
  const triggerAlert = (severity, title, message) => {
    setAlert({
      show: true,
      severity,
      title,
      message,
    });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000); // 3秒後に非表示
  };

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
      <AnimatedAlert
        show={alert.show}
        severity={alert.severity}
        title={alert.title}
        message={alert.message}
      />
      <Routes>
        <Route
          path="/sign-in"
          element={<SignIn triggerAlert={triggerAlert} />}
        />
        <Route
          path="/sign-up"
          element={<SignUp triggerAlert={triggerAlert} />}
        />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default Main;