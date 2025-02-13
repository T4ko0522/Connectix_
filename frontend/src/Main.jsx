import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import SignIn from './pages/Sign_in.jsx';
import SignUp from './pages/Sign_up.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/dashboard.jsx';
import VerifyEmail from './pages/verifyEmail.jsx';
import NotFound from './pages/404.jsx';
import Forbidden from './pages/403.jsx';
import { handleAuthCallback } from "./components/Auth.jsx";
import AnimatedAlert from './shared/AnimatedAlert.jsx'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      handleAuthCallback().then(() => navigate("/")); // ✅ 認証後にトップページへリダイレクト
    }
  }, []);

  return <p>Google 認証処理中...</p>;
};

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
    severity: 'info', // 'success', 'error', 'info', 'warning'
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
    // 3秒後に自動で閉じる
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const showHeader = !['/sign-in', '/sign-up'].includes(location.pathname);

  return (
    <div
      style={{
        background: '#1e202c',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {showHeader && <Header />}
      <ToastContainer position="bottom-right" style={{ zIndex: 9999 }} />
      <AnimatedAlert
        show={alert.show}
        severity={alert.severity}
        title={alert.title}
        message={alert.message}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard triggerAlert={triggerAlert} />} />
        <Route path="/sign-in" element={<SignIn triggerAlert={triggerAlert} />} />
        <Route path="/sign-up" element={<SignUp triggerAlert={triggerAlert} />} />
        <Route path="/verify-email" element={<VerifyEmail triggerAlert={triggerAlert} />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </div>
  );
};

export default Main;