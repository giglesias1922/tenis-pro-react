import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { generateDraw } from "../../services/tournamentsService";

export const TournamentGenerator = ({ tournamentId, onTournamentUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerateDraw = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await generateDraw(tournamentId);

      setSuccess(true);
      if (onTournamentUpdated) {
        onTournamentUpdated();
      }
    } catch (error) {
      console.error("Error generating draw:", error);
      setError(
        error.response?.data?.message || "Error al generar el draw del torneo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Generar Draw del Torneo -
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="textSecondary" paragraph>
            Al generar el draw del torneo se realizarán las siguientes acciones:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🏆 Fase de Zonas
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Se ordenarán los jugadores por ranking
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Se asignarán cabezas de serie a cada zona
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Se distribuirán los demás jugadores aleatoriamente
                  </Typography>
                  <Typography variant="body2">
                    • Se generarán los partidos de todos contra todos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🏅 Fase Eliminatoria
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Los mejores de cada zona clasificarán
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Se generará el bracket principal
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Si está habilitado, se generará la Copa de Plata
                  </Typography>
                  <Typography variant="body2">
                    • El torneo cambiará a estado "Iniciado"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ¡Draw generado exitosamente! El torneo ha sido iniciado.
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGenerateDraw}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Generando..." : "Generar Draw"}
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            ⚠️ Importante:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Una vez generado el draw, no se podrán modificar las inscripciones.
            Asegúrate de que todos los jugadores estén correctamente inscritos
            antes de continuar.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
