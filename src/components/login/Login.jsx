import { useState, useEffect, useContext } from "react";
import useForm from "../../hooks/useForm";
import { loginUser, ResentActivationEmail } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { UserContext, UserProvider } from "../../context/UserContext";
import { showAlert } from "../Common/AlertSuccess";

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
import { CenterFocusStrong } from "@mui/icons-material";

export const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useContext(UserContext);
  const [openAlertActivate, setOpenAlertActivate] = useState(false);

  const { formData, handleChange, resetForm, resetFields } = useForm({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    general: "",
    userName: "",
    password: "",
  });

  const handleCloseAlertActivate = () => {
    setOpenAlertActivate(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({ general: "" });

      const resul = await loginUser(formData.userName, formData.password);

      if (resul.success) {
        login(resul.token);
        navigate("/");
      } else if (resul.errorCode === 5) {
        setIsLoading(false);
        setOpenAlertActivate(true);
      } else {
        setIsLoading(false);
        setErrors({ general: resul.errorDescription });
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.errorCode === 2) {
        setErrors({ general: "Credenciales inválidas" });
      } else {
        setErrors({
          general: error.response?.data?.errorDescription || error.message,
        });
      }
    } finally {
      setIsLoading(false);
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

  const handleResentActivationEmail = async () => {
    const user = {
      Email: formData.userName,
    };

    const response = await ResentActivationEmail(user);

    setOpenAlertActivate(false);

    showAlert(
      " Te enviamos un correo de activación. Si no lo ves, revisá tu carpetade spam."
    );
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
          <Grid container spacing={2} direction="column">
            {/* EMAIL */}
            <Grid item>
              <TextField
                fullWidth
                id="userName"
                name="userName"
                label="Email"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <FormHelperText error>{errors.userName}</FormHelperText>
              )}
            </Grid>

            {/* CONTRASEÑA */}
            <Grid item>
              <TextField
                fullWidth
                name="password"
                id="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>

            {/* ERROR GENERAL */}
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              {errors.general && (
                <FormHelperText error>{errors.general}</FormHelperText>
              )}
            </Grid>

            {/* BOTÓN */}
            <Grid item>
              <Button
                fullWidth
                variant="contained"
                type="submit"
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

            {/* LINKS ADICIONALES */}
            <Grid item sx={{ textAlign: "center" }}>
              ¿No tenés cuenta?{" "}
              <Link href="/register" underline="hover" sx={{ ml: 1 }}>
                [Registrate]
              </Link>
            </Grid>
            <Grid item sx={{ textAlign: "center" }}>
              <Link href="/resetpassword" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog
        open={openAlertActivate}
        onClose={handleCloseAlertActivate}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title" color="primary">
          Atención
        </DialogTitle>
        <DialogContent>
          El usuario aún no ha sido activado. ¿Queres que reenviemos el mail de
          activación?
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={handleResentActivationEmail}
          >
            Reenviar
          </Button>
          <Button
            color="secundary"
            variant="contained"
            onClick={() => setOpenAlertActivate(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
