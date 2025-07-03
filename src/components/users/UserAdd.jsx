import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useForm from "../../hooks/useForm";
import {
  createUser,
  updateUser,
  getUserById,
} from "../../services/userService";
import { getCategories } from "../../services/categoriesService";
import { getProfiles } from "../../services/profilesService";
import { IconButton, Box, Avatar, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
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
import { uploadImageToCloudinary } from "../../helpers/imageUploadHelper";

export const UserAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const isEdit = id !== "new" && id !== undefined;
  const imageInputRef = useRef();
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
      status: 1,
    });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    profileid: "",
    categoryId: "",
    birthdate: null,
    email: "",
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // No subas la imagen acá
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!validate()) return;

    try {
      let user = {
        id: id,
        name: formData.name,
        lastName: formData.lastName,
        phone1: formData.phone || "",
        comment: formData.comment,
        email: formData.email,
        image: formData.image, // Mantenemos la imagen existente por ahora
        profileId: formData.profileId,
        categoryId: formData.categoryId,
        birthdate: formData.birthDate
          ? new Date(formData.birthDate).toISOString()
          : null,
        status: 1,
      };

      let response;
      let userId;
      let imageUrl;

      if (isEdit) {
        console.log("selectedImageFile", selectedImageFile);
        // Si estamos editando, primero subimos la imagen con el ID existente
        if (selectedImageFile) {
          const imageUrl = await uploadImageToCloudinary(selectedImageFile, id);
          user.image = imageUrl;
        }

        console.log("imageUrl", imageUrl);

        response = await updateUser(id, user);
      } else {
        // Si es alta, primero creamos el usuario sin imagen
        response = await createUser(user);

        if (response.success && selectedImageFile) {
          // Ahora que tenemos el ID, subimos la imagen y actualizamos el usuario
          userId = response.data.id; // Ajusta esto según la respuesta de tu API
          const imageUrl = await uploadImageToCloudinary(
            selectedImageFile,
            userId
          );

          console.log("imageUrl", imageUrl);
          // Actualizamos el usuario con la imagen
          await updateUser(userId, { ...user, image: imageUrl });
        }
      }

      if (response.success) {
        navigate("/users");
      } else {
        const newErrors = {};
        newErrors.email = response.message;
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      // Aquí podrías mostrar un mensaje de error más específico
      // Por ejemplo, si falló la subida de la imagen vs si falló la creación del usuario
    }
  };

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
          image: user.image || "",
          birthDate: user.birthDate?.split("T")[0], // Para formato 'YYYY-MM-DD'
          categoryId: user.categoryId,
          status: user.status || 0, // Se asegura que el valor de "active" se pase correctamente
          profileId: user.profileId,
          comment: user.comment,
        });

        setSelectedImageFile(null);
        setImagePreview("");
      });
    }
  }, [id]);

  return (
    <Container maxWidth="md">
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

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={imagePreview || formData.image || "/sin-imagen.png"}
              sx={{ width: 120, height: 120 }}
            />
            <Tooltip title="Cambiar imagen">
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  width: 32,
                  height: 32,
                }}
                onClick={() => imageInputRef.current.click()}
              >
                <EditIcon sx={{ fontSize: 16 }} />
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
            <Grid size={6}>
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
            <Grid size={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText error>{errors.lastName}</FormHelperText>
              )}
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email || ""}
                disabled={isEdit}
                onChange={handleChange}
              />
              {errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>
            <Grid size={4}>
              <TextField
                id="date"
                label="Fecha de Nacimiento"
                type="date"
                name="birthDate"
                value={formData.birthDate || ""}
                onChange={handleChange}
                helperText={errors.birthDate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              {errors.birthDate && (
                <FormHelperText error>{errors.birthDate}</FormHelperText>
              )}
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  onChange={handleChange}
                  name="categoryId"
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
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel id="profile-label">Perfil</InputLabel>
                <Select
                  labelId="profile-label"
                  onChange={handleChange}
                  value={formData.profileId}
                  name="profileId"
                >
                  {profiles.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.profileId && (
                  <FormHelperText error>{errors.profileId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                label="DNI"
                value={formData.identification || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleChange}
                    name="status"
                  />
                }
                label="Activo"
              />
            </Grid>
            <Grid size={12}>
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
            <Grid size={12}>
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
