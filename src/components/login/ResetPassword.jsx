import React, { useState, useEffect } from "react";
import { changePassword } from "../../services/authService";
import useForm from "../../hooks/useForm";
import { showAlert } from "../Common/AlertSuccess";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Link,
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Alert,
  FormHelperText,
  CircularProgress,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getUserById } from "../../services/userService";

export const ResetPassword = () => {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const decoded = parseJwt(token);
  const [isLoading, setIsLoading] = useState(false);

  const { formData, handleChange, resetForm, resetFields } = useForm({
    email: decoded.email,
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    password2: "",
  });

  const validateForm = () => {
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (!formData.password2) newErrors.password2 = "Confirme la contraseña";

    if (
      formData.password &&
      formData.password2 &&
      formData.password != formData.password2
    )
      newErrors.password2 = "Las contraseñas no pueden ser distintas";

    if (formData.password)
      newErrors.password = validatePasswordPolicy(formData.password);
  };

  const validatePasswordPolicy = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Mínimo 8 caracteres, una mayúscula y un número
    return (
      regex.test(password) ||
      "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
    );
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!validateForm()) return;

      isLoading(true);

      const user = {
        email: email,
        password: formData.password,
      };

      const response = await changePassword(user);

      if (response.success) {
        showAlert("Se ha registrado el cambio de contraseña con éxito.");
        navigate("/login");
      } else setErrors({ password: response.message });
    } catch (error) {
      setErrors({ email: error.message });
    } finally {
      isLoading(false);
    }
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

        <form onSubmit={handleSubmit}>
          <Grid item sm={5}>
            <Typography>{formData.email}</Typography>
          </Grid>
          <Grid item sm={3} sx={{ mt: 2 }}>
            <TextField
              type="password"
              fullWidth
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              label="Contraseña"
            />
            {errors.password && (
              <FormHelperText>{errors.password}</FormHelperText>
            )}
          </Grid>
          <Grid item sm={3} sx={{ mt: 2 }}>
            <TextField
              type="password"
              fullWidth
              label="Confirmar la contraseña"
              value={formData.password2 || ""}
              onChange={handleChange}
            />
            {errors.password2 && (
              <FormHelperText>{errors.password2}</FormHelperText>
            )}
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
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
