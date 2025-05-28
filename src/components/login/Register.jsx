import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { register } from "../../services/authService";
import { getCategories } from "../../services/categoriesService";

import {
  IconButton,
  Box,
  Avatar,
  Tooltip,
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const Register = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef();

  const { formData, setFormData, handleChange } = useForm({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    image: "",
    categoryId: "",
    birthDate: null,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const showAlert = () => {
    setOpenAlert(true);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!validate()) return;
    setIsLoading(true);

    const user = {
      name: formData.name,
      lastName: formData.lastName,
      phone1: formData.phone || "",
      email: formData.email,
      image: formData.image || "",
      categoryid: formData.categoryId,
      birthdate: formData.birthDate
        ? new Date(formData.birthDate).toISOString()
        : null,
      password: formData.password,
    };

    try {
      await register(user);
      showAlert();
    } catch (error) {
      setIsLoading(false);
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleBackClick = () => {
    navigate(from);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    navigate(from);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!formData.birthDate) newErrors.birthDate = "La fecha es obligatoria";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.categoryId)
      newErrors.categoryId = "La categoría es obligatoria";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Ingrese un email válido";
    }

    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          Nuevo usuario
        </Typography>

        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={formData.image || "/sin-imagen.png"}
              sx={{ width: 120, height: 120 }}
            />
            <Tooltip title="Cambiar imagen">
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                }}
                onClick={() => imageInputRef.current.click()}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={handleImageChange}
            />
          </Box>
        </Box>

        <form onSubmit={handleSubmit} key={id}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Fecha de nacimiento"
                value={formData.birthDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, birthDate: newValue }))
                }
                format="DD/MM/YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.birthDate}
                    helperText={errors.birthDate}
                  />
                )}
              />
            </Grid>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Reingresar contraseña"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.categoryId}</FormHelperText>
              </FormControl>
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
          Te enviamos un correo de activación. Si no lo ves, revisá tu carpeta
          de spam.
        </Alert>
      </Snackbar>
    </Container>
  );
};
