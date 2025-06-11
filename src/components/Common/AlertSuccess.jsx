import React, { useState, useEffect } from "react";
import { Alert, Dialog, DialogContent, Backdrop } from "@mui/material";

let showAlertExternal;

export const AlertSuccess = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    showAlertExternal = (msg) => {
      setMessage(msg);
      setOpen(true);

      // Auto close después de 3 segundos
      setTimeout(() => setOpen(false), 4000);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // oscurece fondo
      }}
      PaperProps={{
        style: {
          background: "transparent",
          boxShadow: "none",
          overflow: "visible",
        },
      }}
    >
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        <Alert
          variant="filled"
          severity="info"
          sx={{ fontSize: "1rem", width: "100%" }}
          onClose={() => setOpen(false)}
        >
          {message}
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export const showAlert = (message) => {
  if (typeof showAlertExternal === "function") {
    showAlertExternal(message);
  } else {
    console.warn("⚠️ AlertSuccess no está montado.");
  }
};
