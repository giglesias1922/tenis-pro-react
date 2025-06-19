import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const ErrorHandler = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleShowError = (event) => {
      setMessage(event.detail.message);
      setOpen(true);
    };

    window.addEventListener('showError', handleShowError);

    return () => {
      window.removeEventListener('showError', handleShowError);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}; 