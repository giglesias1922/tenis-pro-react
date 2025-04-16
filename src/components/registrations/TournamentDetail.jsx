import { React, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CloseIcon from "@mui/icons-material/Close";
import { RegistrationsView } from "./RegistrationsView";
import {
  Box,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { getTournamentById } from "../../services/tournamentsService";

export const TournamentDetail = ({ tournamentId, onRegistrationChange }) => {
  const [tournamentDetail, setTournamentDetail] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      getTournamentById(tournamentId).then(setTournamentDetail);
    } else {
      setTournamentDetail(null);
    }
  }, [tournamentId]);

  // 🧠 NO renderizar nada si no hay torneo seleccionado o si no cargó aún
  if (!tournamentId) return null;

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Card sx={{ backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ color: "text.secondary" }}>Sede:</Typography>
              <Typography variant="h6">
                {tournamentDetail?.locationDescription}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Categoría:
              </Typography>
              <Typography variant="h6">
                {tournamentDetail?.categoryDescription}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <Typography sx={{ color: "text.secondary" }}>Cierre:</Typography>
              <Typography variant="h7">
                {new Date(tournamentDetail?.closeDate).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>Inicio:</Typography>
              <Typography variant="h7">
                {new Date(tournamentDetail?.initialDate).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Finaización:
              </Typography>
              <Typography variant="h7">
                {new Date(tournamentDetail?.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button size="small" onClick={() => setOpenModal(true)}>
                Ver inscriptos
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Grid>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Inscripciones
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <RegistrationsView
            tournamentId={tournamentId}
            onRegistrationChange={onRegistrationChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
