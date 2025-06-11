import React, { useState } from "react";
import { resetPasswordRequest } from "../../services/authService";
import useForm from "../../hooks/useForm";
import { showAlert } from "../Common/AlertSuccess";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";

export const ResetPasswordRequest = () => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { formData, setFormData, handleChange } = useForm({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const validate = () => {
    setIsLoading(true);

    try {
      const newErrors = {};
      if (!formData.email) newErrors.email = "El email es obligatorio";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Ingrese un email válido";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch {
      setIsLoading(true);
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!validate()) return;
    setIsLoading(true);

    const user = {
      email: formData.email,
    };

    try {
      const response = await resetPasswordRequest(user);

      if (response.success) {
        showAlert(
          "Te enviamos un correo de reseteo de contaseña. Si no lo ves, revisá tu carpeta de spam."
        );
        navigate("/login");
      } else setErrors({ email: response.message });
    } catch (error) {
      setErrors({ email: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          Cambio de contraseña
        </Typography>

        <form onSubmit={handleSubmit} key={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Confirmando..." : "Confirmar"}
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
