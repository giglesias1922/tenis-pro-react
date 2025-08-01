import React, { useEffect, useState, useContext } from "react";
import {
  getTournamentsBoard,
  getTournamentById,
} from "../../services/tournamentsService";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../Common/AlertMessage";
import { addParticipant } from "../../services/tournamentsService";

import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { TextAlignment } from "@cloudinary/url-gen/qualifiers";

export const TournamentBoard = () => {
  const [data, setData] = useState([]);
  const { isAuthenticated, user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var response = getTournamentsBoard().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    var response = getTournamentById(selectedId).then((res) => {
      setSelectedTournament(res);
    });
  }, [selectedId]);

  const handleOpen = (tournament) => {
    console.log(selectedTournament);
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setError(null);

    setSelectedId(tournament.id);

    setOpenGenerateDialog(true);
  };

  const handleCancelGenerate = () => {
    setOpenGenerateDialog(false);
  };

  const validate = () => {
    if (selectedTournament.status != 0) {
      setError("Ya ha cerrado el período de inscripción para el torneo");
      return false;
    }

    return true;
  };

  const handleConfirmRegistration = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setClosing(true);

    const obj = {
      tournamentId: selectedTournament.id,
      players: [user?.id],
      createdBy: user?.id,
      displayName: user?.name,
    };

    try {
      var response = await addParticipant(obj);

      if (response.success) {
        setOpenGenerateDialog(false);

        showMessage("Inscripción registrada ✅", "success");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error handleConfirmRegistration:", error);
      showMessage("Ocurrió un error ❌", "error");
    } finally {
      setClosing(false);
    }
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      <Grid container spacing={2} elevation={3}>
        {data.map((tournament) => (
          <Grid item xs={12} sm={6} mt={5} ml={5} md={4} key={tournament.id}>
            <Card>
              <CardMedia
                component="img"
                image={tournament.image}
                alt="Tournament banner"
                sx={{
                  height: 400, // Altura fija (podés ajustar a gusto)
                  maxWidth: 400, // Que ocupe todo el ancho de la Card
                  objectFit: "contain", // Para que no se recorte ni deforme
                  backgroundColor: "#000", // Opcional: relleno negro si sobra espacio
                }}
              />
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleOpen(tournament)}
                >
                  Inscribirse
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={openGenerateDialog}
        onClose={handleCancelGenerate}
        maxWidth="sm"
        fullWidth={false}
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(30, 30, 30, 0.5)",
          },
        }}
      >
        <DialogTitle>Inscripción al torneo</DialogTitle>
        <DialogContent>
          {selectedTournament && (
            <Grid container spacing={1} alignItems="center">
              {/* Columna izquierda: imagen */}
              <Grid item xs={12} sm={4}>
                <Box
                  component="img"
                  src={selectedTournament.image}
                  alt="Banner del torneo"
                  sx={{
                    width: "100%", // ocupa todo el ancho del Grid
                    maxHeight: 200, // alto máximo
                    objectFit: "contain", // que no se deforme
                    borderRadius: 1,
                  }}
                />
              </Grid>

              {/* Columna derecha: textos */}
              <Grid item xs={12} sm={8}>
                <Typography>
                  <strong>Sede:</strong>{" "}
                  {selectedTournament.locationDescription}
                </Typography>
                <Typography mt={1}>
                  <strong>Tipo:</strong>{" "}
                  {selectedTournament.tournamentTypeDescription}
                </Typography>
                <Typography mt={1}>
                  <strong>Categoría:</strong>{" "}
                  {selectedTournament.categoryDescription}
                </Typography>
                <Typography mt={1}>
                  <strong>Cierre de inscripción:</strong>{" "}
                  {new Date(selectedTournament.closeDate).toLocaleDateString()}
                </Typography>
                <Typography mt={1}>
                  <strong>Inicio:</strong>{" "}
                  {new Date(
                    selectedTournament.initialDate
                  ).toLocaleDateString()}
                </Typography>
                {error && (
                  <FormHelperText mt={1} sx={{ fontSize: "1rem" }} error>
                    {error}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancelGenerate}>Cancelar</Button>
          <Button
            onClick={handleConfirmRegistration}
            color="warning"
            disabled={closing || !selectedTournament?.participants?.length}
            startIcon={closing ? <CircularProgress size={20} /> : null}
          >
            {closing ? "Inscribiendo..." : "Inscribirse"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
