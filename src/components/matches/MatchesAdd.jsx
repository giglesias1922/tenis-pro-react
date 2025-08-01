import { useState, useEffect, useContext } from "react";
import useForm from "../../hooks/useForm";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { TournamentDetail } from "../Common/TournamentDetail";
import {
  GetTournamentsToProgramming,
  getTournamentById,
  getParticipant,
} from "../../services/tournamentsService";
import { createMatch } from "../../services/matchesService";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  TextField,
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
  Box,
  IconButton,
} from "@mui/material";

export const MatchesAdd = () => {
  const { userLog } = useContext(UserContext);
  const navigate = useNavigate();
  const [tournamentsList, setTournamentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [errors, setErrors] = useState({
    tournamentId: "",
    registration1: "",
    registration2: "",
    scheduledDate: null,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tournamentType, setTournamentType] = useState(null);

  const { formData, handleChange, resetForm, resetFields } = useForm({
    tournamentId: "",
    registration1: "",
    registration2: "",
    scheduledDate: null,
  });

  useEffect(() => {
    GetTournamentsToProgramming().then(setTournamentsList);
  }, []);

  const refreshUsers = () => {
    if (formData.tournamentId) {
      getTournamentById(formData.tournamentId).then((data) => {
        setTournamentType(data.tournamentType);
        if (data?.categoryId) {
          getParticipant(formData.tournamentId).then((data) => {
            setUsersList(data);
          });
        }
      });
    }
  };

  useEffect(() => {
    if (formData.tournamentId) {
      refreshUsers();
    }
  }, [formData.tournamentId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.tournamentId) {
      newErrors.tournamentId = "Selecciona un torneo";
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Debe indicar la fecha y hora programada";
    } else {
      // Validación de fecha y hora para asegurarse de que no sea en el pasado
      const selectedDateTime = new Date(formData.scheduledDate);
      const currentDateTime = new Date();

      if (selectedDateTime <= currentDateTime) {
        newErrors.scheduledDate = "La fecha y hora no pueden ser en el pasado";
      }
    }

    if (!formData.registration1 || !formData.registration2) {
      newErrors.registration2 = "Selecciona ambos jugadores";
    } else if (formData.registration1 === formData.registration2) {
      newErrors.registration2 = "Los jugadores deben ser diferentes";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const playersArray = [
      formData.registration1,
      formData.registration2,
    ].filter((p) => p); // armás el array de players

    const obj = {
      tournamentid: formData.tournamentId,
      registrations: playersArray,
      createdby: userLog?.id,
      scheduledDate: formData.scheduledDate,
    };

    try {
      await createMatch(obj);
      refreshUsers();
      setOpenSnackbar(true);

      resetFields(["registration1", "registration2"]);
    } catch (error) {
      console.error("Error al guardar el torneo:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/matches");
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          marginTop: 4,
          position: "relative",
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Nuevo partido
        </Typography>
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
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
            <Grid size={12}>
              <FormControl fullWidth error={!!errors.scheduledDate}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fecha y hora programada"
                    value={formData.scheduledDate}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: "scheduledDate", value: newValue },
                      })
                    }
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
                {errors.scheduledDate && (
                  <FormHelperText>{errors.scheduledDate}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid size={5}>
                  <FormControl fullWidth error={!!errors.registration1}>
                    <InputLabel id="player1-label">Jugador 1</InputLabel>
                    <Select
                      labelId="registration1-label"
                      name="registration1"
                      value={formData.registration1 || ""}
                      onChange={handleChange}
                    >
                      {usersList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.registration1 && (
                      <FormHelperText>{errors.registration1}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={2}>
                  <Typography align="center" variant="h6">
                    vs
                  </Typography>
                </Grid>

                <Grid size={5}>
                  <FormControl fullWidth error={!!errors.registration2}>
                    <InputLabel id="player2-label">Jugador 2</InputLabel>
                    <Select
                      labelId="player2-label"
                      name="registration2"
                      value={formData.registration2 || ""}
                      onChange={handleChange}
                    >
                      {usersList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.registration2 && (
                      <FormHelperText>{errors.registration2}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
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
