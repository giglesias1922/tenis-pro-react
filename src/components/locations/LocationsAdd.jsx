import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"; // Importamos react-hook-form
import {
  createLocation,
  updateLocation,
  getLocationById,
} from "../../services/locationsService";
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

export const LocationsAdd = () => {
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

    const row = {
      id: id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      active: data.active || false, // El valor de "active" es false por defecto
    };

    try {
      if (isEdit) {
        await updateLocation(id, row);
      } else {
        await createLocation(row);
      }
      navigate("/locations");
    } catch (error) {
      console.error("Error al guardar la sede:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/locations");
  };

  useEffect(() => {
    if (isEdit) {
      getLocationById(id).then((data) => {
        reset({
          name: data.name,
          address: data.address,
          phone: data.phone,
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
          {isEdit ? "Edición de Sede" : "Nueva Sede"}
        </Typography>

        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} key={id}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                value={watch("name") || ""}
                label="Nombre"
                {...register("name", {
                  required: "El nombre es obligatorio",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid size={7}>
              <TextField
                fullWidth
                value={watch("address") || ""}
                label="Dirección"
                {...register("address", {
                  required: "La dirección  es obligatoria",
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid size={5}>
              <TextField
                fullWidth
                value={watch("phone") || ""}
                label="Teléfono"
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid size={12}>
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
