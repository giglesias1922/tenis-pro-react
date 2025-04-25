import { useState, useEffect, useContext } from "react";
import useForm from "../../hooks/useForm";
import { TournamentDetail } from "../Common/TournamentDetail";
import {
  GetTournamentsToProgramming,
  getTournamentById,
} from "../../services/tournamentsService";
import {
  createRegistration,
  getRegistrations,
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

export const MatchesAdd = () => {
  const { userLog } = useContext(UserContext);
  const [tournamentsList, setTournamentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [errors, setErrors] = useState({ tournamentId: "", userId: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tournamentType, setTournamentType] = useState(null);

  const { formData, handleChange, resetForm } = useForm({
    tournamentId: "",
    players: ["", ""],
  });

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = value;
    handleChange({ target: { name: "players", value: newPlayers } }); // Usamos handleChange aquí
  };

  useEffect(() => {
    GetTournamentsToProgramming().then(setTournamentsList);
  }, []);

  const refreshUsers = () => {
    console.log("1");
    if (formData.tournamentId) {
      console.log("2");
      getTournamentById(formData.tournamentId).then((data) => {
        setTournamentType(data.tournamentType);
        if (data?.categoryId) {
          getRegistrations(formData.tournamentId).then((data) => {
            setUsersList(data);
            console.log("data usr", data);
          });
        }
      });
    }
  };

  useEffect(() => {
    refreshUsers();
  }, [formData.tournamentId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.tournamentId) {
      newErrors.tournamentId = "Selecciona un torneo";
    }

    const [player1, player2] = formData.players;

    if (tournamentType === 0) {
      if (!player1) {
        newErrors.players = "Selecciona un jugador";
      }
    }

    if (tournamentType === 1) {
      if (!player1 || !player2) {
        newErrors.players = "Selecciona ambos jugadores";
      } else if (player1 === player2) {
        newErrors.players = "Los jugadores deben ser diferentes";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const obj = {
      tournamentid: formData.tournamentId,
      players: formData.players.filter((p) => p), // quitar vacíos
      createdby: userLog?.id,
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
          Nuevo encuentro
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
              tournamentType={tournamentType}
            />
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={5}>
                  <FormControl fullWidth error={!!errors.players}>
                    <InputLabel id="player1-label">Jugador 1</InputLabel>
                    <Select
                      labelId="player1-label"
                      value={formData.players[0]}
                      onChange={(e) => handlePlayerChange(0, e.target.value)}
                    >
                      {usersList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name} {option.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.players && (
                      <FormHelperText>{errors.players}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  <Typography align="center" variant="h6">
                    vs
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel id="player2-label">Jugador 2</InputLabel>
                    <Select
                      labelId="player2-label"
                      value={formData.players[1]}
                      onChange={(e) => handlePlayerChange(1, e.target.value)}
                    >
                      {usersList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name} {option.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!formData.tournamentId || !formData.players}
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
