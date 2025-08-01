// AlertMessage.jsx
import React, { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

let showMessageExternal;

export const AlertMessage = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success"); // 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    showMessageExternal = ({ msg, type }) => {
      setMessage(msg);
      setSeverity(type); // 'success' o 'error'
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
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

// función para llamar desde cualquier lugar
export const showMessage = (msg, type = "success") => {
  if (typeof showMessageExternal === "function") {
    showMessageExternal({ msg, type });
  } else {
    console.warn("⚠️ AlertMessage no está montado.");
  }
};
