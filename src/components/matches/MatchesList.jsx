import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import { useNavigate } from "react-router-dom";
import { getMatches, deleteMatch } from "../../services/matchesService.js";
import {
  IconButton,
  Fab,
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { MatchHistory } from "./MatchHistory.jsx";
import { MatchResultAdd } from "./MatchResultAdd.jsx";
import { ClosedCaptionDisabledOutlined } from "@mui/icons-material";

export const MatchesList = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [openResult, setOpenResult] = useState(false);

  const onModalResultClose = () => {
    setOpenResult(false);
  };

  const handleAddClick = () => {
    navigate("/matches/new");
  };

  const handleEditClick = (id) => {
    navigate(`/matches/${id}`);
  };

  const handleOpenHistory = (id) => {
    setSelectedId(id);
    setOpenHistory(true);
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  const handleOpenResult = (id) => {
    setSelectedId(id);
    setOpenResult(true);
  };

  const handleCloseResult = () => {
    setOpenResult(false);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);

    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMatch(selectedId);

      // Recargar los datos después de la eliminación
      const updatedData = await getMatches();
      setdata(updatedData);
    } catch (error) {
      console.error("Error al eliminar el match:", error);
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  const onGridReload = () => {
    getMatches().then((data) => {
      setdata(data);
    });
  };

  useEffect(() => {
    getMatches().then((data) => {
      setdata(data);
    });
  }, []);

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
    {
      field: "history",
      headerName: "",
      flex: 1,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params) => (
        <Tooltip title="Ver historia">
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenHistory(params.row.id)}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "result",
      headerName: "",
      flex: 1,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params) =>
        params.row.status < 2 ? (
          <Tooltip title="Cargar resultado">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenResult(params.row.id)}
            >
              <ScoreboardIcon />
            </IconButton>
          </Tooltip>
        ) : null,
    },
    { field: "tournamentDescription", headerName: "Torneo", flex: 1 },
    { field: "playerAName", headerName: "Jugador A", flex: 1 },
    { field: "playerBName", headerName: "Jugador B", flex: 1 },
    { field: "statusDescription", headerName: "Estado", flex: 1 },
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
          >
            <DeleteIcon />
          </IconButton>
        ) : null,
    },
  ];

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          Partidos
        </Typography>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </div>

        {/* Contenedor para posicionar el FAB */}
        <Box sx={{ position: "absolute", top: -20, right: -20 }}>
          <Fab color="primary" aria-label="add" onClick={handleAddClick}>
            <AddIcon />
          </Fab>
        </Box>
      </Paper>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          Si elimina el partido, se eliminarán sus resultados y su historial
          ¿Estás seguro de que deseas eliminar el partido?
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

      {/*Dialog History*/}
      <Dialog
        open={openHistory}
        onClose={handleCloseHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Historia del Partido</DialogTitle>
        <DialogContent dividers>
          <MatchHistory Id={selectedId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistory}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/*Dialog Result*/}
      <Dialog
        open={openResult}
        onClose={handleCloseResult}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Resultado del partido</DialogTitle>
        <DialogContent dividers>
          <MatchResultAdd
            matchId={selectedId}
            onModalResultClose={onModalResultClose}
            onGridReload={onGridReload}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResult}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
