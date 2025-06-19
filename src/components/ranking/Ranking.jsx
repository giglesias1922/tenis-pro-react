import React, { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import { getRanking } from "../../services/rankingService";
import { getCategories } from "../../services/categoriesService";
import { getTournamentTypes } from "../../services/tournamentsService";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  Box,
  Paper,
  Button,
  Container,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";

export const Ranking = () => {
  const [categories, setCategories] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tournamentTypes, setTournamentTypes] = useState([]);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const { formData, setFormData, handleChange, resetForm, resetFields } =
    useForm({
      categoryId: "",
      tournamentType: "",
      year: currentYear,
    });

  const [errors, setErrors] = useState({
    categoryId: "",
    tournamentType: "",
    year: "",
  });

  useEffect(() => {
    getCategories().then(setCategories);
    getTournamentTypes().then(setTournamentTypes);
  }, []);

  const validateForm = () => {
    const newErrors = [];

    if (!formData.categoryId)
      newErrors.categoryId = "Debe indicar la categoría.";

    if (!formData.tournamentType)
      newErrors.tournamentType = "Debe indicar el tipo de ranking.";

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  const handleSubmit = async (event) => {
    try {
      event?.preventDefault();

      if (!validateForm()) return;

      const response = await getRanking(
        formData.categoryId,
        formData.tournamentType,
        formData.year
      );

      const data = [];

      if (!response.success) {
        setRankingData(response);
      }
    } catch (error) {
      console.error("Error al obtener el ranking:", error);
    }
  };

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          Ranking
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={3} sm={3}>
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
            <Grid item xs={3} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="tournamentType-label">Tipo</InputLabel>
                <Select
                  labelId="tournamentType-label"
                  name="tournamentType"
                  onChange={handleChange}
                  value={formData.tournamentType}
                >
                  {tournamentTypes.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tournamentType && (
                  <FormHelperText error>{errors.tournamentType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="year-label">Año</InputLabel>
                <Select
                  labelId="year-label"
                  value={formData.year}
                  label="Año"
                  onChange={handleChange}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Generar
              </Button>
            </Grid>
          </Grid>
        </form>

        <TableContainer component={Paper} elevation={3} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Jugador</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Edad</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Puntos</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>+/-</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankingData.map((data) => (
                <TableRow key={data.rank}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ width: 24 }}>
                        {data.rank}.
                      </Typography>
                      <Avatar
                        alt={data.name}
                        src={data.image}
                        sx={{ width: 32, height: 32, mx: 1 }}
                      />
                      <Typography variant="body2">{data.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{data.age}</TableCell>
                  <TableCell align="right">
                    {data.points.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        data.delta > 0
                          ? "green"
                          : data.delta < 0
                          ? "red"
                          : "text.primary",
                    }}
                  >
                    {data.delta > 0 ? `+${data.delta}` : data.delta}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};
