import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import { getTournamentById } from "../../services/tournamentsService";
import { RegistrationsAdd } from "../registrations/RegistrationsAdd";
import { RegistrationsView } from "../registrations/RegistrationsView";
import { TournamentBoard } from "./TournamentBoard";
import { TournamentGenerator } from "./TournamentGenerator";

export const TournamentManagement = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tournamentId) {
      loadTournament();
    }
  }, [tournamentId]);

  const loadTournament = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTournamentById(tournamentId);
      setTournament(data);
    } catch (error) {
      console.error("Error loading tournament:", error);
      setError("Error al cargar el torneo");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleTournamentUpdated = () => {
    loadTournament();
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Torneo no encontrado
        </Alert>
      </Container>
    );
  }

  const isOpenForRegistrations = tournament.status === "Open";
  const isProgramming = tournament.status === "Programming";
  const isInitiated = tournament.status === "Initiated";

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          {tournament.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="textSecondary">
            Estado: <strong>{tournament.status}</strong>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Tipo: <strong>{tournament.tournamentType === 0 ? "Singles" : "Doubles"}</strong>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Jugadores por zona: <strong>{tournament.playersPerZone}</strong>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Clasifican por zona: <strong>{tournament.qualifiersPerZone}</strong>
          </Typography>
          {tournament.includePlata && (
            <Typography variant="body1" color="textSecondary">
              Incluye Copa de Plata: <strong>Sí</strong>
            </Typography>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Inscripciones" disabled={!isOpenForRegistrations} />
            <Tab label="Generar Draw" disabled={!isProgramming} />
            <Tab label="Tablero del Torneo" disabled={!isInitiated} />
          </Tabs>
        </Box>

        {selectedTab === 0 && isOpenForRegistrations && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Inscripciones al Torneo
            </Typography>
            <RegistrationsAdd />
          </Box>
        )}

        {selectedTab === 1 && isProgramming && (
          <Box>
            <TournamentGenerator 
              tournamentId={tournamentId} 
              onTournamentUpdated={handleTournamentUpdated}
            />
          </Box>
        )}

        {selectedTab === 2 && isInitiated && (
          <Box>
            <TournamentBoard tournamentId={tournamentId} />
          </Box>
        )}

        {!isOpenForRegistrations && !isProgramming && !isInitiated && (
          <Alert severity="info">
            El torneo no está en un estado que permita modificaciones.
          </Alert>
        )}
      </Paper>
    </Container>
  );
}; 