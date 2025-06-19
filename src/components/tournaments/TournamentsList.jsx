import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoriesService";
import { getLocations } from "../../services/locationsService";
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
import {
  getTournaments,
  deleteTournament,
} from "../../services/tournamentsService.js";
import { Visibility } from "@mui/icons-material";

export const TournamentsList = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [filterLocationId, setFilterLocationId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const handleAddClick = () => {
    navigate("/tournaments/new");
  };

  const handleEditClick = (id) => {
    navigate(`/tournaments/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedTournamentId(id);
    setOpenConfirm(true);
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

  useEffect(() => {
    getCategories().then(setCategories);
    getLocations().then(setLocations);
    getTournaments().then((data) => {
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
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon />
          </IconButton>
        ) : null,
    },
    { field: "description", headerName: "Descripción", flex: 1 },
    { field: "locationDescription", headerName: "Sede", flex: 1 },
    { field: "categoryDescription", headerName: "Categoría", flex: 1 },
    { field: "tournamentTypeDescription", headerName: "Tipo", flex: 1 },
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
          Torneos
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
