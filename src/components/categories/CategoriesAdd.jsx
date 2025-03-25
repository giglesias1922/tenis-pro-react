import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"; // Importamos react-hook-form
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../../services/categoriesService";
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
} from "@mui/material";

export const CategoriesAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

    const category = {
      id: id,
      description: data.description,
      active: data.active || false, // El valor de "active" es false por defecto
    };

    try {
      if (isEdit) {
        await updateCategory(id, category);
      } else {
        await createCategory(category);
      }
      navigate("/categories");
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/categories");
  };

  useEffect(() => {
    if (isEdit) {
      getCategoryById(id).then((data) => {
        reset({
          description: data.description,
          active: data.active,
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
          {isEdit ? "Edición de Categoría" : "Nueva Categoría"}
        </Typography>

        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} key={id}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                value={watch("description") || ""}
                label="Descripción"
                {...register("description", {
                  required: "La descripción es obligatoria",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register("active")}
                    checked={watch("active") ?? true} // Usamos watch para obtener el valor
                    onChange={(e) => setValue("active", e.target.checked)} // Actualiza el estado en react-hook-form
                    name="active"
                  />
                }
                label="Activa"
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
