import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

export const BracketView = ({ bracket, title, participants = [] }) => {
  if (!bracket || !bracket.rounds || bracket.rounds.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography color="textSecondary">
          El bracket aún no ha sido generado
        </Typography>
      </Paper>
    );
  }

  const getParticipantName = (participantId) => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.displayName : "TBD";
  };

  const renderMatch = (matchId, index) => (
    <Box
      key={matchId}
      sx={{
        p: 1,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        backgroundColor: "#f8f9fa",
        mb: 1,
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        Partido {index + 1}
      </Typography>
      <Chip
        label="Pendiente"
        size="small"
        color="warning"
        variant="outlined"
      />
    </Box>
  );

  const renderRound = (round, roundIndex) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={roundIndex}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
            {round.name}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {round.matchIds.map((matchId, matchIndex) => 
              renderMatch(matchId, matchIndex)
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        {title}
      </Typography>
      
      <Grid container spacing={2}>
        {bracket.rounds.map((round, roundIndex) => 
          renderRound(round, roundIndex)
        )}
      </Grid>
    </Paper>
  );
};

export const ZoneView = ({ zones, participants = [] }) => {
  if (!zones || zones.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Zonas
        </Typography>
        <Typography color="textSecondary">
          Las zonas aún no han sido generadas
        </Typography>
      </Paper>
    );
  }

  const getParticipantName = (participantId) => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.displayName : "Jugador no encontrado";
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Fase de Zonas
      </Typography>
      
      <Grid container spacing={3}>
        {zones.map((zone, zoneIndex) => (
          <Grid item xs={12} sm={6} md={4} key={zone.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  {zone.name}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {zone.participantIds.map((participantId, participantIndex) => (
                    <Box
                      key={participantId}
                      sx={{
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        backgroundColor: participantIndex < 2 ? "#e8f5e8" : "#fff3e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {getParticipantName(participantId)}
                      </Typography>
                      <Chip
                        label={participantIndex < 2 ? "Clasifica" : "Eliminado"}
                        color={participantIndex < 2 ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}; 