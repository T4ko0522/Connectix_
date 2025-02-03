import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SignIn from './pages/Sign_in.jsx';
import SignUp from './pages/Sign_up.jsx';
import { handleAuthCallback } from "./components/Auth.jsx";
import AnimatedAlert from './shared/AnimatedAlert.jsx'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const Main = () => {
  const location = useLocation();
  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      handleAuthCallback(); // ✅ Google認証後の処理を実行
    }
  }, []);

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
    // 3秒後に自動で閉じたい場合は、ここで状態を戻す
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const noHeaderFooterRoutes = ['/sign-in', '/sign-up'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div
      style={{
        background: '#1e202c',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {showHeaderFooter && <Header />}
      <ToastContainer
        position="bottom-right"
        style={{ zIndex: 9999 }}
      />
      {/* これが toast を制御するコンポーネント */}
      <AnimatedAlert
        show={alert.show}
        severity={alert.severity}
        title={alert.title}
        message={alert.message}
      />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/sign-in" element={<SignIn triggerAlert={triggerAlert} />} />
        <Route path="/sign-up" element={<SignUp triggerAlert={triggerAlert} />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default Main;