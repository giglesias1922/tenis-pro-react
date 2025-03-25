import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"; // Importamos react-hook-form
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

export const UsersAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const isEdit = id !== "new" && id !== undefined;

  // Inicializamos useForm
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data, event) => {
    event?.preventDefault(); // Evita recargar la página

    const user = {
      id: id,
      name: data.name,
      lastname: data.lastName,
      phone1: data.phone || "",
      phone2: "",
      email: data.email,
      image: "",
      profileid: data.profileId,
      categoryId: data.categoryId,
      birthdate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
      active: data.active || false, // El valor de "active" es false por defecto
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

  const handleBackClick = () => {
    navigate("/users");
  };

  useEffect(() => {
    getCategories().then(setCategories);
    getProfiles().then(setProfiles);
    if (isEdit) {
      getUserById(id).then((user) => {
        reset({
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
  }, [id, reset]);

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          {isEdit ? "Edición de Jugador" : "Nuevo Jugador"}
        </Typography>

        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} key={id}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={watch("name") || ""}
                label="Nombre"
                {...register("name", { required: "El nombre es obligatorio" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={watch("lastName") || ""}
                label="Apellido"
                {...register("lastName", {
                  required: "El apellido es obligatorio",
                })}
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={watch("email") || ""}
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de email inválido",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={watch("phone") || ""}
                {...register("phone")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="date"
                label="Fecha de Nacimiento"
                type="date"
                value={watch("birthDate") || ""}
                {...register("birthDate")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  {...register("categoryId", {
                    required: "Selecciona una categoría",
                  })}
                  onChange={(e) => setValue("categoryId", e.target.value)} // Asegura la actualización
                  value={watch("categoryId") || ""} // Evita valores vacíos
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <FormHelperText>{errors.categoryId.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth error={!!errors.profileId}>
                <InputLabel id="profile-label">Perfil</InputLabel>
                <Select
                  labelId="profile-label"
                  {...register("profileId", {
                    required: "Selecciona el perfil",
                  })}
                  onChange={(e) => setValue("profileId", e.target.value)} // Asegura la actualización
                  value={watch("profileId") || ""} // Evita valores vacíos
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register("active")}
                    checked={watch("active") || true} // Usamos watch para obtener el valor
                    onChange={(e) => setValue("active", e.target.checked)} // Actualiza el estado en react-hook-form
                    name="active"
                  />
                }
                label="Activo"
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
