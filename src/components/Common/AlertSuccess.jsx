import React, { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

let showAlertExternal;

export const AlertSuccess = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    showAlertExternal = (msg) => {
      setMessage(msg);
      setOpen(true);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export const showAlert = (message) => {
  if (typeof showAlertExternal === "function") {
    showAlertExternal(message);
  } else {
    console.warn("⚠️ AlertSuccess no está montado.");
  }
};
