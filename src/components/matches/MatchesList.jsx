import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../../services/matchesService.js";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Visibility } from "@mui/icons-material";

export const MatchesList = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleAddClick = () => {
    navigate("/matches/new");
  };

  const handleEditClick = (id) => {
    navigate(`/matches/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletematch(selectedId);
      // Recargar los datos después de la eliminación
      const updatedData = await getMatches();
      setdata(updatedData);
    } catch (error) {
      console.error("Error al eliminar el match:", error);
    } finally {
      setOpenConfirm(false);
      setSelectedTournamentId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  useEffect(() => {
    getMatches().then(setdata);
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
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon />
          </IconButton>
        ) : null,
    },
    { field: "TournamentDescription", headerName: "Torneo", flex: 1 },
    { field: "PlayerAName", headerName: "Sede", flex: 1 },
    { field: "PlayerBName", headerName: "Categoría", flex: 1 },
    { field: "Status", headerName: "Estado", flex: 1 },
    {
      field: "closeDate",
      headerName: "Cierre",
      flex: 1,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("es-ES"),
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
    </Container>
  );
};
