import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { register } from "../../services/authService";
import { getCategories } from "../../services/categoriesService";
import { IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
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
} from "@mui/material";

export const Register = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);

  const { formData, setFormData, handleChange, resetForm, resetFields } =
    useForm({
      name: "",
      lastName: "",
      phone1: "",
      email: "",
      image: "",
      categoryId: "",
      birthDate: null,
    });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    categoryId: "",
    birthdate: null,
    email: "",
  });

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event) => {
    event?.preventDefault(); // Evita recargar la página

    if (!validate()) return;

    const user = {
      name: formData.name,
      lastName: formData.lastName,
      phone1: formData.phone || "",
      email: formData.email,
      image: "",
      categoryid: formData.categoryId,
      birthdate: formData.birthDate
        ? new Date(formData.birthDate).toISOString()
        : null,
    };

    try {
      await register(user);

      navigate("/login");
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const location = useLocation();
  const from = location.state?.from || "/"; // si no hay "from", vuelve a "/"

  const handleBackClick = () => {
    navigate(from);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";

    if (!formData.birthDate)
      newErrors.birthDate = "La Fecha de Nacimiento es obligatoria";

    if (!formData.email) newErrors.email = "El email es obligatorio";

    if (!formData.categoryId)
      newErrors.categoryId = "La categoría es obligatoria";

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Ingrese un email válido";
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  useEffect(() => {
    getCategories().then(setCategories);
  });

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

        <form onSubmit={handleSubmit} key={id}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText error>{errors.name}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
              {errors.nalastNameme && (
                <FormHelperText error>{errors.lastName}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Fecha de nacimiento"
                name="birthDate"
                value={formData.birthDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, birthDate: newValue }))
                }
                format="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              {errors.birthDate && (
                <FormHelperText error>{errors.birthDate}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              {errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                name="phone"
                label="Teléfono"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  onChange={handleChange}
                  value={formData.categoryId}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <FormHelperText error>{errors.categoryId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Seleccionar imagen
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData((prev) => ({
                          ...prev,
                          image: reader.result, // base64
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>

              {/* Mostrar vista previa de imagen si existe */}
              {formData.image && (
                <Box mt={2}>
                  <img
                    src={formData.image}
                    alt="Vista previa"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
