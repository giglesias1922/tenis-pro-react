import { useState, useEffect, useContext } from "react";
import useForm from "../../hooks/useForm";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

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
} from "@mui/material";
import { CenterFocusStrong } from "@mui/icons-material";

export const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);

  const { formData, handleChange, resetForm, resetFields } = useForm({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    general: "",
    userName: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);

      var token = await loginUser(formData.userName, formData.password);

      login(token);

      navigate("/");
    } catch (error) {
      setIsLoading(false);
      setErrors({ general: error.message });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Ingrese el nombre de usuario";
    }

    if (!formData.password) {
      newErrors.password = "Ingrese la contraseña";
    }

    if (formData.userName) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.userName)) {
        newErrors.userName = "Ingrese un email válido";
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          Ingresar
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TextField
                id="userName"
                name="userName"
                label="Email"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                fullWidth
              ></TextField>
              {errors.userName && (
                <FormHelperText error>{errors.userName}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TextField
                name="password"
                id="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              ></TextField>
              {errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              {errors.general && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    justifyContent: "center", // centra ícono + texto
                    textAlign: "center", // centra texto si se va a más de una línea
                  }}
                >
                  {errors.general}
                </Alert>
              )}
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
                {isLoading ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", mt: 3, justifyContent: "center" }}
        >
          ¿No tenés cuenta?
          <Link href="/register" underline="hover" sx={{ ml: 1 }}>
            [Registrate]
          </Link>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", mt: 3, justifyContent: "center" }}
        >
          <Link href="/resetpass" underline="hover">
            ¿Olvidaste tu contraseña?
          </Link>
        </Grid>
      </Paper>
    </Container>
  );
};
