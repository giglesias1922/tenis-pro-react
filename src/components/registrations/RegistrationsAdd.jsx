import { useState, useEffect, useContext } from "react";
import useForm from "../../hooks/useForm";
import { RegistrationsView } from "./RegistrationsView";
import { TournamentDetail } from "../Common/TournamentDetail";
import { AlertSuccess, showAlert } from "../Common/AlertSuccess";
import {
  getTournamentsToRegistration,
  getTournamentById,
} from "../../services/tournamentsService";
import {
  createRegistration,
  getUsersToRegistration,
} from "../../services/registrationsService";
import { UserContext } from "../../context/UserContext";
import CloseIcon from "@mui/icons-material/Close";

import {
  Dialog,
  DialogTitle,
  DialogContent,
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
  IconButton,
} from "@mui/material";

export const RegistrationsAdd = () => {
  const { userLog } = useContext(UserContext);
  const [tournamentsList, setTournamentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [errors, setErrors] = useState({
    tournamentId: "",
    player1: "",
    player2: "",
  });
  const [tournamentType, setTournamentType] = useState(null);
  const [tournamentDescription, setTournamentDescription] = useState(null);
  const [SelectedTournamentId, setSelectedTournamentId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [ValidForm, setValidForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, handleChange, resetForm } = useForm({
    tournamentId: "",
    player1: "",
    player2: "",
  });

  useEffect(() => {
    getTournamentsToRegistration().then(setTournamentsList);
  }, []);

  const refreshUsers = () => {
    if (formData.tournamentId) {
      getTournamentById(formData.tournamentId).then((data) => {
        setTournamentType(data.tournamentType);

        if (data?.categoryId) {
          getUsersToRegistration(data.categoryId, formData.tournamentId).then(
            setUsersList
          );
        }
      });
    }
  };

  const GetDisplayName = () => {
    let displayName = "";

    const player1 = usersList.find((u) => u.id === formData.player1);

    if (tournamentType === 1 && player1) {
      displayName = `${player1.name} ${player1.lastName}`;
    }

    if (tournamentType === 2 && player1) {
      const player2 = usersList.find((u) => u.id === formData.player2);

      if (player2) {
        displayName = `${player1.name} ${player1.lastName} / ${player2.name} ${player2.lastName}`;
      }
    }

    return displayName;
  };

  useEffect(() => {
    setSelectedTournamentId(formData.tournamentId);
    refreshUsers();
  }, [formData.tournamentId]);

  const validate = () => {
    const newErrors = {};

    if (!formData.tournamentId) {
      newErrors.tournamentId = "Selecciona un torneo";
    }

    if (tournamentType === 1) {
      if (!formData.player1) {
        newErrors.player1 = "Selecciona un jugador";
      }
    }

    if (tournamentType === 2) {
      if (!formData.player1 || !formData.player2) {
        newErrors.player2 = "Selecciona ambos jugadores";
      } else if (formData.player1 === formData.player2) {
        newErrors.player2 = "Los jugadores deben ser diferentes";
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    setValidForm(isValid);

    return isValid;
  };

  useEffect(() => {
    if (formData.tournamentId && (formData.player1 || formData.player2)) {
      validate();
    }
  }, [formData.player1, formData.player2, formData.tournamentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const playersArray = [formData.player1, formData.player2].filter((p) => p); // armás el array de players

    const obj = {
      tournamentId: formData.tournamentId,
      players: playersArray,
      createdBy: userLog?.id ?? formData.player1,
      displayName: GetDisplayName(),
    };

    try {
      await createRegistration(obj);
      refreshUsers();
      showAlert("¡Registro guardado con éxito!");
    } catch (error) {
      console.error("Error al guardar la inscripción:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
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
              tournamentType={tournamentType}
            />

            {SelectedTournamentId && (
              <Box
                sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <Button size="small" onClick={() => setOpenModal(true)}>
                  Ver inscriptos
                </Button>
              </Box>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.player1}>
                <InputLabel id="player1-label">Jugador</InputLabel>
                <Select
                  labelId="player1-label"
                  name="player1"
                  value={formData.player1 || ""}
                  onChange={handleChange}
                >
                  {usersList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name} {option.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.player1 && (
                  <FormHelperText>{errors.player1}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {tournamentType === 2 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="player2-label">Jugador 2</InputLabel>
                  <Select
                    labelId="player2-label"
                    name="player2"
                    value={formData.player2 || ""}
                    onChange={handleChange}
                  >
                    {usersList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name} {option.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!ValidForm || isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <AlertSuccess />

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(30, 30, 30, 0.5)",
          },
        }}
      >
        <DialogContent dividers>
          <RegistrationsView
            tournamentId={formData.tournamentId}
            tournamentType={tournamentType}
            tournamentDescription={
              tournamentsList.find((t) => t.id === formData.tournamentId)
                ?.description
            }
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};
