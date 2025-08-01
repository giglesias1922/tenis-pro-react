import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import {
  generateDraw,
  getTournamentById,
} from "../../services/tournamentsService.js";
import {
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  FormHelperText,
  Paper,
  Box,
  Divider,
  CircularProgress,
  TextField,
} from "@mui/material";

export const TournamentDrawGenerator = () => {
  const { id: selectedId } = useParams();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const { formData, setFormData, handleChange } = useForm({
    playersPerZone: 4,
    qualifiersPerZone: 2,
    includePlata: false,
  });

  const [errors, setErrors] = useState({
    playersPerZone: "",
    qualifiersPerZone: "",
  });

  useEffect(() => {
    getTournamentById(selectedId).then(setFormData);
  }, [selectedId]);

  const validateForm = () => {
    const newErrors = {};
    const participantsCount = formData?.participants?.length || 0;

    if (formData.playersPerZone > participantsCount) {
      newErrors.playersPerZone = `No puede ser mayor a ${participantsCount} (total de inscriptos)`;
    }
    if (formData.qualifiersPerZone > formData.playersPerZone) {
      newErrors.qualifiersPerZone = `No puede ser mayor a ${formData.playersPerZone} (jugadores por zona)`;
    }
    if (formData.playersPerZone < 2) {
      newErrors.playersPerZone = "Mínimo 2 jugadores por zona";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setGenerating(true);
      const drawConfig = {
        includePlata: formData.includePlata,
        playersPerZone: formData.playersPerZone,
        qualifiersPerZone: formData.qualifiersPerZone,
      };

      await generateDraw(formData.id, drawConfig);
      navigate("/tournaments");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Error al generar el draw del torneo",
      });
    } finally {
      setGenerating(false);
    }
  };

  const calculateNumberOfZones = () => {
    const participantsCount = formData?.participants?.length || 0;
    return participantsCount > 0
      ? Math.ceil(participantsCount / formData.playersPerZone)
      : 0;
  };

  const calculateTotalQualifiers = () => {
    return calculateNumberOfZones() * formData.qualifiersPerZone;
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          marginTop: 4,
          position: "relative",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Generación de draw. Torneo: <b>Primer Torneo de A</b>
        </Typography>

        <Divider sx={{ my: 2, color: "white", backgroundColor: "white" }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {/* Cantidad de inscriptos */}
            <Grid size={12}>
              <Typography>
                <strong>Cantidad de inscriptos:</strong>{" "}
                {formData.participants?.length || 0}
              </Typography>
            </Grid>

            {/* Selects uno al lado del otro */}
            <Grid size={4}>
              <FormControl sx={{ minWidth: 200 }}>
                <TextField
                  name="playersPerZone"
                  label="Jugadores por zona"
                  type="number"
                  value={formData.playersPerZone}
                  onChange={handleChange}
                  onBlur={validateForm}
                  sx={{ width: 150 }}
                  InputProps={{ inputProps: { min: 1 } }} // opcional: evita números negativos
                  error={Boolean(errors.playersPerZone)}
                  helperText={errors.playersPerZone}
                />
                <Typography variant="caption" color="textSecondary">
                  Cantidad de zonas: {calculateNumberOfZones()}
                </Typography>
              </FormControl>
            </Grid>

            <Grid size={4}>
              <FormControl sx={{ minWidth: 200 }}>
                <TextField
                  name="qualifiersPerZone"
                  label="Clasifican por zona"
                  type="number"
                  value={formData.qualifiersPerZone}
                  onChange={handleChange}
                  onBlur={validateForm}
                  sx={{ width: 150 }}
                  InputProps={{ inputProps: { min: 1 } }} // opcional: evita números negativos
                  error={Boolean(errors.qualifiersPerZone)}
                  helperText={errors.qualifiersPerZone}
                />
                <Typography variant="caption" color="textSecondary">
                  Total de clasificados: {calculateTotalQualifiers()}
                </Typography>
              </FormControl>
            </Grid>

            {/* Checkbox */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includePlata}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Incluir Copa de Plata"
              />
            </Grid>

            {/* Error general */}
            {errors.general && (
              <Grid size={12}>
                <Alert severity="error">{errors.general}</Alert>
              </Grid>
            )}

            {/* Botones alineados al centro */}
            <Grid size={12}>
              <Box sx={{ display: "flex", justifyContent: "right", gap: 2 }}>
                <Button
                  onClick={() => navigate("/tournaments")}
                  variant="outlined"
                  color="primary"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={generating || errors.length > 0}
                  startIcon={generating ? <CircularProgress size={20} /> : null}
                >
                  {generating ? "Generando..." : "Generar Draw"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
