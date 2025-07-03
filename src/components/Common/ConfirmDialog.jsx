import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(30, 30, 30, 0.5)",
        },
      }}
    >
      <DialogTitle>{title || "Confirmación"}</DialogTitle>
      <DialogContent>
        <Typography>{message || "¿Estás seguro de que querés continuar?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
