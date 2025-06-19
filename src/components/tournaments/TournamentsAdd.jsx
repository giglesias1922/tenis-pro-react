import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import {
  createTournament,
  updateTournament,
  getTournamentById,
  getTournamentTypes,
} from "../../services/tournamentsService";
import { getCategories } from "../../services/categoriesService";
import { getLocations } from "../../services/locationsService";
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

export const TournamentsAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [Status, setStatus] = useState();
  const isEdit = id !== "new" && id !== undefined;
  const [tournamentTypes, setTournamentTypes] = useState([]);
  const imageInputRef = useRef();

  const { formData, setFormData, handleChange, resetForm, resetFields } =
    useForm({
      description: "",
      closeDate: "",
      initialDate: "",
      endDate: "",
      locationId: "",
      categoryId: "",
      tournamentType: "",
      image: "",
    });

  const [errors, setErrors] = useState({
    description: "",
    closeDate: "",
    initialDate: "",
    endDate: "",
    locationId: "",
    categoryId: "",
    tournamentType: "",
  });

  useEffect(() => {
    getCategories().then(setCategories);
    getLocations().then(setLocations);
    getTournamentTypes().then(setTournamentTypes);
  }, []);

  useEffect(() => {
    if (isEdit) {
      getTournamentById(id).then((data) => {
        setFormData({
          description: data.description || "",
          closeDate: data.closeDate
            ? new Date(data.closeDate).toISOString().split("T")[0]
            : "",
          initialDate: data.initialDate
            ? new Date(data.initialDate).toISOString().split("T")[0]
            : "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",
          locationId: data.locationId || "",
          categoryId: data.categoryId || "",
          tournamentType: data.tournamentType || "",
        });

        setStatus(data.status);
      });
    }
  }, [id, isEdit]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (!formData.tournamentType) {
      newErrors.tournamentType = "Selecciona un tipo de torneo";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Selecciona una categoría";
    }

    if (!formData.locationId) {
      newErrors.locationId = "Selecciona la sede";
    }

    // Validaciones de fechas
    const closeDate = formData.closeDate ? new Date(formData.closeDate) : null;
    const initialDate = formData.initialDate
      ? new Date(formData.initialDate)
      : null;
    const endDate = formData.endDate ? new Date(formData.endDate) : null;

    if (closeDate && initialDate && closeDate >= initialDate) {
      newErrors.closeDate =
        "La fecha de cierre debe ser anterior a la fecha de inicio";
    }

    if (initialDate && endDate && initialDate >= endDate) {
      newErrors.initialDate =
        "La fecha de inicio debe ser anterior a la fecha de fin";
    }

    if (closeDate && endDate && closeDate >= endDate) {
      newErrors.endDate =
        "La fecha de cierre debe ser anterior a la fecha de fin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tournament = {
      id: id,
      description: formData.description,
      closeDate: formData.closeDate
        ? new Date(formData.closeDate).toISOString()
        : null,
      initialDate: formData.initialDate
        ? new Date(formData.initialDate).toISOString()
        : null,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
      locationId: formData.locationId,
      categoryId: formData.categoryId,
      tournamentType: formData.tournamentType,
      status: isEdit ? Status : 0,
    };

    try {
      if (isEdit) {
        await updateTournament(id, tournament);
      } else {
        await createTournament(tournament);
      }
      navigate("/tournaments");
    } catch (error) {
      console.error("Error al guardar el torneo:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/tournaments");
  };

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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="closeDate"
                label="Cierre de inscripción"
                type="date"
                name="closeDate"
                value={formData.closeDate}
                onChange={handleChange}
                helperText={errors.closeDate}
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
                name="initialDate"
                value={formData.initialDate}
                onChange={handleChange}
                error={!!errors.initialDate}
                helperText={errors.initialDate}
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
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
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
                  name="tournamentType"
                  value={formData.tournamentType}
                  onChange={handleChange}
                >
                  {tournamentTypes.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tournamentType && (
                  <FormHelperText>{errors.tournamentType}</FormHelperText>
                )}
              </FormControl>
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
                {errors.categoryId && (
                  <FormHelperText>{errors.categoryId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel id="location-label">Sede</InputLabel>
                <Select
                  labelId="location-label"
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                >
                  {locations.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.locationId && (
                  <FormHelperText>{errors.locationId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Imagen Banner */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  component="span"
                  onClick={() => imageInputRef.current.click()}
                  sx={{ mb: 1 }}
                >
                  Banner
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={imageInputRef}
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Banner del torneo"
                    sx={{ width: '100%', maxWidth: 400, height: 'auto', borderRadius: 2, mt: 1, boxShadow: 2 }}
                  />
                )}
              </Box>
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
