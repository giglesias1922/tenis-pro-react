import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useForm from "../../hooks/useForm";
import {
  createUser,
  updateUser,
  getUserById,
} from "../../services/userService";
import { getCategories } from "../../services/categoriesService";
import { getProfiles } from "../../services/profilesService";
import { IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  TextField,
  Switch,
  FormControlLabel,
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

export const UserAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const isEdit = id !== "new" && id !== undefined;

  const { formData, setFormData, handleChange, resetForm, resetFields } =
    useForm({
      name: "",
      lastName: "",
      phone1: "",
      comment: "",
      email: "",
      image: "",
      profileId: "",
      categoryId: "",
      birthDate: null,
      active: false,
    });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    profileid: "",
    categoryId: "",
    birthdate: null,
  });

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event) => {
    event?.preventDefault(); // Evita recargar la página

    if (!validate()) return;

    const user = {
      id: id,
      name: formData.name,
      lastName: formData.lastName,
      phone1: formData.phone || "",
      comment: formData.comment,
      email: formData.email,
      image: "",
      profileId: formData.profileId,
      categoryId: formData.categoryId,
      birthdate: formData.birthDate
        ? new Date(formData.birthDate).toISOString()
        : null,
      active: formData.active || false, // El valor de "active" es false por defecto
    };

    try {
      if (isEdit) {
        await updateUser(id, user);
      } else {
        await createUser(user);
      }
      navigate("/users");
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const location = useLocation();

  const handleBackClick = () => {
    navigate("/users");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";

    if (!formData.birthDate)
      newErrors.birthDate = "La Fecha de Nacimiento es obligatoria";

    if (!formData.email) newErrors.email = "El email es obligatorio";

    if (!formData.profileId) newErrors.profileId = "El perfil es obligatorio";

    if (!formData.categoryId)
      newErrors.categoryId = "La categoría es obligatoria";

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Ingrese un email válido";
      }
    }
    console.log("newErrors", newErrors);
    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  useEffect(() => {
    getCategories().then(setCategories);
    getProfiles().then(setProfiles);
    if (isEdit) {
      getUserById(id).then((user) => {
        setFormData({
          name: user.name,
          lastName: user.lastName,
          phone: user.phone1,
          email: user.email,
          birthDate: user.birthDate?.split("T")[0], // Para formato 'YYYY-MM-DD'
          categoryId: user.categoryId,
          active: user.active || false, // Se asegura que el valor de "active" se pase correctamente
          profileId: user.profileId,
        });
      });
    }
  }, [id]);

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          {isEdit ? "Edición de usuario" : "Nuevo usuario"}
        </Typography>

        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit} key={id}>
          <Grid container spacing={2}>
            <Grid item sm={4}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
              {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
            </Grid>
            <Grid item sm={4}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText>{errors.lastName}</FormHelperText>
              )}
            </Grid>
            <Grid item sm={2}>
              <TextField
                id="date"
                label="Fecha de Nacimiento"
                type="date"
                name="birthDate"
                value={formData.birthDate || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText>{errors.birthDate}</FormHelperText>
              )}
            </Grid>

            <Grid item sm={4}>
              <TextField
                fullWidth
                label="DNI"
                value={formData.identification || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  onChange={handleChange}
                  value={formData.categoryId}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tournamentId && (
                  <FormHelperText>{errors.categoryId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs="{8}" sm={4}>
              <FormControl fullWidth error={!!errors.profileId}>
                <InputLabel id="profile-label">Perfil</InputLabel>
                <Select
                  labelId="profile-label"
                  onChange={handleChange}
                  value={formData.profileId}
                >
                  {profiles.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.profileId && (
                  <FormHelperText>{errors.profileId.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleChange}
                    name="active"
                  />
                }
                label="Activo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comentario"
                name="comment"
                value={formData.comment || ""}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
              />
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
