import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton, Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoriesService";
import { getLocations } from "../../services/locationsService";
import { RegistrationsView } from "../registrations/RegistrationsView";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import {
  Fab,
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import {
  getTournaments,
  deleteTournament,
  generateDraw,
  getTournamentById,
  closeRegistrations,
} from "../../services/tournamentsService.js";

export const TournamentsList = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  // Estados para el popup de generar draw
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Estados para cerrar inscripciones
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState(null);

  // Estados para el modal de inscripciones
  const [openRegistrationsModal, setOpenRegistrationsModal] = useState(false);
  const [
    selectedTournamentForRegistrations,
    setSelectedTournamentForRegistrations,
  ] = useState(null);

  const handleAddClick = () => {
    navigate("/tournaments/new");
  };

  const handleEditClick = (tournamentId) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  const handleGenerateClick = (tournamentId) => {
    navigate(`/tournaments/${tournamentId}/generate-draw`);
  };

  const handleDeleteClick = (id) => {
    setSelectedTournamentId(id);
    setOpenConfirm(true);
  };

  const handleViewDraw = (tournamentId) => {
    
    // navigate(`/tournaments/${tournamentId}/draw`);
    navigate(`/tournaments/${tournamentId}/zone-draw`);
  };

  const handleCloseRegistrationsClick = (tournament) => {
    setSelectedTournament(tournament);
    setOpenCloseDialog(true);
    setCloseError(null);
  };

  const handleConfirmCloseRegistrations = async () => {
    try {
      setClosing(true);
      setCloseError(null);

      await closeRegistrations(selectedTournament.id);

      // Recargar los datos después de cerrar inscripciones
      const updatedData = await getTournaments();
      setdata(updatedData);

      setOpenCloseDialog(false);
      setSelectedTournament(null);
    } catch (error) {
      console.error("Error al cerrar inscripciones:", error);
      setCloseError(
        error.response?.data?.message || "Error al cerrar inscripciones"
      );
    } finally {
      setClosing(false);
    }
  };

  const handleCancelCloseRegistrations = () => {
    setOpenCloseDialog(false);
    setSelectedTournament(null);
    setCloseError(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTournament(selectedTournamentId);
      // Recargar los datos después de la eliminación
      const updatedData = await getTournaments();
      setdata(updatedData);
    } catch (error) {
      console.error("Error al eliminar el torneo:", error);
    } finally {
      setOpenConfirm(false);
      setSelectedTournamentId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedTournamentId(null);
  };

  const handleViewRegistrations = (tournament) => {
    setSelectedTournamentForRegistrations(tournament);
    setOpenRegistrationsModal(true);
  };

  const handleCloseRegistrationsModal = () => {
    setOpenRegistrationsModal(false);
    setSelectedTournamentForRegistrations(null);
  };

  useEffect(() => {
    getTournaments().then((data) => {
      setdata(data);
    });
  }, []);

  // Función para verificar si se debe mostrar el botón Generar Draw
  const shouldShowGenerateDrawButton = (tournament) => {
    return tournament.status === 2 && tournament.participants?.length > 0;
  };

  // Función para verificar si se debe mostrar el botón Generar
  const shouldShowGenerateButton = (tournament) => {
    return tournament.status === 1 && tournament.participants?.length > 0;
  };

  // Función para verificar si se debe mostrar el botón Cerrar Inscripciones
  const shouldShowCloseRegistrationsButton = (tournament) => {
    // Solo mostrar si pasó la fecha de cierre, está en estado Pending y tiene inscriptos
    return tournament.status === 0 && tournament.participants?.length > 0;
  };

  // Columnas de la grilla
  const columns = [
    {
      field: "edit",
      headerName: "",
      flex: 1,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params) =>
        params.row.status < 2 ? (
          <Tooltip title="Editar">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditClick(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) : null,
    },
    { field: "description", headerName: "Descripción", flex: 2, minWidth: 200 },
    { field: "locationDescription", headerName: "Sede", flex: 1 },
    { field: "categoryDescription", headerName: "Categoría", flex: 1 },
    {
      field: "tournamentTypeDescription",
      headerName: "Tipo",
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "closeDate",
      headerName: "Cierre",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value); // esto ya es UTC si la fecha tiene "Z"
        return new Intl.DateTimeFormat("es-ES", {
          timeZone: "UTC", // <- muy importante
        }).format(date);
      },
    },
    {
      field: "initialDate",
      headerName: "Inicio",
      flex: 1,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("es-ES"),
    },

    {
      field: "endDate",
      headerName: "Fin",
      flex: 1,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("es-ES"),
    },

    { field: "statusName", headerName: "Estado", flex: 1 },
    {
      field: "registrations",
      headerName: "",
      flex: 1,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params) => (
        <Tooltip title="Ver Inscripciones">
          <IconButton
            color="info"
            size="small"
            onClick={() => handleViewRegistrations(params.row)}
          >
            <PersonIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      renderCell: (params) => {
        // Mostrar botón "Cerrar Inscripciones" si status = 0 y pasó la fecha de cierre
        if (shouldShowCloseRegistrationsButton(params.row)) {
          return (
            <IconButton
              color="warning"
              size="small"
              onClick={() => handleCloseRegistrationsClick(params.row)}
              sx={{ marginLeft: 1 }}
              title="Cerrar Inscripciones"
            >
              <LockIcon />
            </IconButton>
          );
        }

        // Mostrar botón "Generar Draw" si status = 1 y la fecha de inicio es futura
        if (shouldShowGenerateButton(params.row)) {
          return (
            <IconButton
              color="success"
              size="small"
              onClick={() => handleGenerateClick(params.row.id)}
              sx={{ marginLeft: 1 }}
              title="Generar Draw"
            >
              <PlayArrowIcon />
            </IconButton>
          );
        }

        if (shouldShowGenerateDrawButton(params.row))
          return (
            <Tooltip title="Ver Draw">
              <IconButton
                color="secondary"
                size="small"
                onClick={() => handleViewDraw(params.row.id)}
              >
                <SportsTennisIcon />
              </IconButton>
            </Tooltip>
          );

        return null;
      },
    },
    {
      field: "delete",
      headerName: "",
      flex: 1,
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      renderCell: (params) =>
        params.row.status < 2 ? (
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
            sx={{ marginLeft: 1 }}
            title="Eliminar"
          >
            <DeleteIcon />
          </IconButton>
        ) : null,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          Torneos
        </Typography>

        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
          />
        </div>

        {/* Contenedor para posicionar el FAB */}
        <Box sx={{ position: "absolute", top: -20, right: -20 }}>
          <Fab color="primary" aria-label="add" onClick={handleAddClick}>
            <AddIcon />
          </Fab>
        </Box>
      </Paper>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(30, 30, 30, 0.5)",
          },
        }}
      >
        <DialogTitle id="confirm-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el torneo?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de cerrar inscripciones */}
      <Dialog
        open={openCloseDialog}
        onClose={handleCancelCloseRegistrations}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(30, 30, 30, 0.5)",
          },
        }}
      >
        <DialogTitle>Cerrar Inscripciones</DialogTitle>
        <DialogContent>
          {selectedTournament && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedTournament.description}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  ¿Estás seguro de que deseas cerrar las inscripciones para este
                  torneo?
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  <strong>Fecha de cierre:</strong>{" "}
                  {new Date(selectedTournament.closeDate).toLocaleDateString(
                    "es-ES"
                  )}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  <strong>Inscriptos actuales:</strong>{" "}
                  {selectedTournament.participants?.length || 0}
                </Typography>
              </Grid>

              {(!selectedTournament.participants ||
                selectedTournament.participants.length === 0) && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    No se puede cerrar un torneo sin inscriptos
                  </Alert>
                </Grid>
              )}

              {closeError && (
                <Grid item xs={12}>
                  <Alert severity="error">{closeError}</Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCloseRegistrations} disabled={closing}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmCloseRegistrations}
            color="warning"
            disabled={closing || !selectedTournament?.participants?.length}
            startIcon={closing ? <CircularProgress size={20} /> : null}
          >
            {closing ? "Cerrando..." : "Cerrar Inscripciones"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de inscripciones */}
      <Dialog
        open={openRegistrationsModal}
        onClose={handleCloseRegistrationsModal}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(30, 30, 30, 0.5)",
          },
        }}
      >
        <DialogContent dividers>
          {selectedTournamentForRegistrations && (
            <RegistrationsView
              tournamentId={selectedTournamentForRegistrations.id}
              tournamentType={selectedTournamentForRegistrations.tournamentType}
              tournamentDescription={
                selectedTournamentForRegistrations.tournamentDescription
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};
