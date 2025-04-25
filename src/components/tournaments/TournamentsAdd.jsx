import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"; // Importamos react-hook-form
import {
  createTournament,
  updateTournament,
  getTournamentById,
} from "../../services/tournamentsService";
import { getCategories } from "../../services/categoriesService";
import { getLocations } from "../../services/locationsService";
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

export const TournamentsAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [Status, setStatus] = useState();
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

    const obj = {
      id: id,
      description: data.description,
      closeDate: data.closeDate ? new Date(data.closeDate).toISOString() : null,
      initialDate: data.initialDate
        ? new Date(data.initialDate).toISOString()
        : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      locationId: data.locationId,
      categoryId: data.categoryId,
      status: isEdit ? Status : 0,
      tournamentType: data.tournamentType,
    };

    console.log("onSubmit", obj);

    try {
      if (isEdit) {
        await updateTournament(id, obj);
      } else {
        await createTournament(obj);
      }
      navigate("/tournaments");
    } catch (error) {
      console.error("Error al guardar el torneo:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/tournaments");
  };

  const tournamentTypes = [
    { value: 0, label: "Single" },
    { value: 1, label: "Double" },
  ];

  useEffect(() => {
    getCategories().then(setCategories);
    getLocations().then(setLocations);
    if (isEdit) {
      getTournamentById(id).then((data) => {
        reset({
          description: data.description,
          closeDate: data.closeDate?.split("T")[0],
          initialDate: data.initialDate?.split("T")[0],
          endDate: data.endDate?.split("T")[0],
          locationId: data.locationId,
          categoryId: data.categoryId,
          status: data.status,
          tournamentType: data.tournamentType,
        });

        setStatus(data.status);
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
          {isEdit ? "Edición de Torneo" : "Nuevo Torneo"}
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
                value={watch("description") || ""}
                label="Description"
                {...register("description", {
                  required: "La descripción es obligatoria",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="closeDate"
                label="Cierre de inscripción"
                type="date"
                value={watch("closeDate") || ""}
                {...register("closeDate")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="initialDate"
                label="Inicio"
                type="date"
                value={watch("initialDate") || ""}
                {...register("initialDate")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                id="endDate"
                label="Fin"
                type="date"
                value={watch("endDate") || ""}
                {...register("endDate")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!errors.tournamentType}>
                <InputLabel id="tournament-type-label">
                  Tipo de Torneo
                </InputLabel>
                <Select
                  labelId="tournament-type-label"
                  {...register("tournamentType", {
                    required: "Selecciona un tipo de torneo",
                  })}
                  onChange={(e) => setValue("tournamentType", e.target.value)}
                  value={watch("tournamentType") ?? ""}
                >
                  {tournamentTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tournamentType && (
                  <FormHelperText>
                    {errors.tournamentType.message}
                  </FormHelperText>
                )}
              </FormControl>
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
              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel id="location-label">Sede</InputLabel>
                <Select
                  labelId="location-label"
                  {...register("locationId", {
                    required: "Selecciona la sede",
                  })}
                  onChange={(e) => setValue("locationId", e.target.value)} // Asegura la actualización
                  value={watch("locationId") || ""} // Evita valores vacíos
                >
                  {locations.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.locationId && (
                  <FormHelperText>{errors.locationId.message}</FormHelperText>
                )}
              </FormControl>
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
