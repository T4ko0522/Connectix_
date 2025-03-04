import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import AnimatedAlert from '../shared/AnimatedAlert.jsx';

function ForgotPassword({ open, handleClose }) {
  const emailRef = React.useRef(null);
  const [showAlert, setShowAlert] = useState(true);
  const [showEmailErrorAlert, setShowEmailErrorAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current?.value;

    if (!email) {
        setShowEmailErrorAlert(true);
        setTimeout(() => setShowEmailErrorAlert(false), 3000);
        return;
    }

    try {
        //LINK - Local
          // await fetch("http://localhost:3522/api/password-reset/request-reset", {
          await fetch("https://connectix-server.vercel.app/api/password-reset/request-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        setShowAlert(true);
    } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3000);
    }
};

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          handleClose();
        },
        sx: { backgroundImage: 'none' },
      }}
    >
      <AnimatedAlert
        show={showEmailErrorAlert}
        severity="error"
        title="Error"
        message="Emailを入力してください。"
      />
      <AnimatedAlert
        show={showAlert}
        severity="info"
        title="info"
        message="メールを送信しました。"
      />
      <AnimatedAlert
        show={showErrorAlert}
        severity="error"
        title="Error!"
        message={"APIサーバーのエラー" + errorMessage}
      />
      <DialogTitle>パスワードリセット</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          メールアドレスを入力して送信すると、パスワードをリセットするためのリンクがメールに送信されます。
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          inputRef={emailRef}  // ← 修正点
          name="email"
          placeholder="メールアドレス"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained" type="submit">
          リンクを送信
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;