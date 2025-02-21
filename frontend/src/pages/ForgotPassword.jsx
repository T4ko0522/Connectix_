import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

function ForgotPassword({ open, handleClose }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = document.getElementById("email")?.value;

    if (!email) {
        alert("メールアドレスを入力してください！");
        return;
    }

    try {
        //LINK - Local
        // const response = await fetch("http://localhost:3522/api/password-reset/request-reset", {
        const response = await fetch("https://connectix-server.vercel.app/api/password-reset/request-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("パスワードリセットエラー:", error);
        alert("サーバーエラーが発生しました。");
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
          id="email"
          name="email"
          label="メールアドレス"
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
