import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnimatedAlert = ({ show, severity, title, message }) => {
  useEffect(() => {
    if (show) {
      const options = {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      };

      switch (severity) {
        case 'success':
          toast.success(`${title}: ${message}`, options);
          break;
        case 'info':
          toast.info(`${title}: ${message}`, options);
          break;
        case 'warning':
          toast.warn(`${title}: ${message}`, options);
          break;
        case 'error':
          toast.error(`${title}: ${message}`, options);
          break;
        default:
          toast(`${title}: ${message}`, options);
      }
    }
  }, [show, severity, title, message]);
  return (
    <>
      <ToastContainer />
    </>
  );
};

AnimatedAlert.propTypes = {
  show: PropTypes.bool.isRequired,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default AnimatedAlert;