import React, { useState } from "react";
import useForm from "../../hooks/useForm";
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
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { formData, setFormData, handleChange } = useForm({
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
      await resetPaswordRequest(user);
      showAlert();
    } catch (error) {
      setIsLoading(false);
      console.error("Error resetPasword:", error);
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
          Recuperar contraseña
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
          <Grid item xs={12}>
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
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={() => setOpenAlert(false)}
          sx={{ width: "100%" }}
        >
          Te enviamos un correo de recuperacón de contaseña. Si no lo ves,
          revisá tu carpeta de spam.
        </Alert>
      </Snackbar>
    </Container>
  );
};
