import React, { useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './pages/Sign_in';
import SignUp from './pages/Sign_up';
import AnimatedAlert from './shared/AnimatedAlert'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    // 3秒後に自動で閉じたい場合は、ここで状態を戻す
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // サインイン・サインアップ画面ではヘッダーとフッターを出さない
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
        <Route
          path="/sign-in"
          element={<SignIn triggerAlert={triggerAlert} />}
        />
        <Route
          path="/sign-up"
          element={<SignUp triggerAlert={triggerAlert} />}
        />

        {/* 上記以外はすべて sign-in にリダイレクト */}
        <Route
          path="*"
          element={<Navigate to="/sign-in" replace />}
        />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default Main;