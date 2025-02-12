import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnimatedAlert = ({ show, severity, title, message }) => {
  const alertSeverity = severity || "info"; // デフォルト値を設定

  useEffect(() => {
    if (show) {
      const options = {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };

      switch (alertSeverity) { // ここで修正
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
  }, [show, alertSeverity, title, message]);

  return null; // ToastContainerはルートコンポーネントでレンダリング
};

AnimatedAlert.propTypes = {
  show: PropTypes.bool.isRequired,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default AnimatedAlert;