import { useState, useEffect, useContext } from "react";
import useForm from "../../hooks/useForm";
import { RegistrationsView } from "./RegistrationsView";
import { TournamentDetail } from "./TournamentDetail";
import {
  getTournaments,
  getTournamentById,
} from "../../services/tournamentsService";
import {
  createRegistration,
  getUsersToRegistration,
} from "../../services/registrationsService";
import { UserContext } from "../../context/UserContext";

import {
  Box,
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
  Snackbar,
  Alert,
} from "@mui/material";

export const RegistrationsAdd = () => {
  const { userLog } = useContext(UserContext);
  const [tournamentsList, setTournamentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [errors, setErrors] = useState({ tournamentId: "", userId: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { formData, handleChange, resetForm } = useForm({
    tournamentId: "",
    userId: "",
  });

  useEffect(() => {
    getTournaments().then(setTournamentsList);
  }, []);

  const refreshUsers = () => {
    if (formData.tournamentId) {
      getTournamentById(formData.tournamentId).then((data) => {
        if (data?.categoryId) {
          getUsersToRegistration(data.categoryId, formData.tournamentId).then(
            setUsersList
          );
        }
      });
    }
  };

  useEffect(() => {
    refreshUsers();
  }, [formData.tournamentId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.tournamentId) newErrors.tournamentId = "Selecciona un torneo";
    if (!formData.userId) newErrors.userId = "Selecciona un jugador";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const obj = {
      tournamentid: formData.tournamentId,
      userid: formData.userId,
      createdby: userLog?.name,
    };

    try {
      await createRegistration(obj);
      refreshUsers();
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al guardar el torneo:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Inscripciones
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <FormControl fullWidth error={!!errors.tournamentId}>
                <InputLabel id="tournament-label">Torneo</InputLabel>
                <Select
                  labelId="tournament-label"
                  name="tournamentId"
                  value={formData.tournamentId}
                  label="Torneo"
                  onChange={handleChange}
                >
                  {tournamentsList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tournamentId && (
                  <FormHelperText>{errors.tournamentId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <TournamentDetail
              tournamentId={formData.tournamentId}
              onRegistrationChange={refreshUsers}
            />

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.userId}>
                <InputLabel id="user-label">Jugador</InputLabel>
                <Select
                  labelId="user-label"
                  name="userId"
                  value={formData.userId}
                  label="Jugador"
                  onChange={handleChange}
                >
                  {usersList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name} {option.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.userId && (
                  <FormHelperText>{errors.userId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!formData.tournamentId || !formData.userId}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Registro guardado con éxito!
        </Alert>
      </Snackbar>
    </Container>
  );
};
