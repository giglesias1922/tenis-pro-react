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
  const { login } = useContext(UserContext);
  const [openAlertActivate, setOpenAlertActivate] = useState(false);
  const [userId, setUserId] = useState(null);

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
    try {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);

      const resul = await loginUser(formData.userName, formData.password);
      console.log(resul);
      if (resul.success) {
        console.log("token", token);
        console.log("userid", result.userId);

        setUserId(result.userId);

        login(token);
        navigate("/");
        return;
      } else if (resul.errorCode === 3) {
        // Mostrar alerta con botón para
        setIsLoading(false);
        setOpenAlertActivate(true);
      } else {
        setIsLoading(false);
        setErrors({ general: resul.errorDescription });
      }

      return;
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

  const handleResentActivationEmail = async () => {
    const user = {
      Id: userId,
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
            <Grid item xs={12} container justifyContent="center">
              {errors.general && (
                <FormHelperText error sx={{ typography: "body1" }}>
                  {errors.general}
                </FormHelperText>
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
