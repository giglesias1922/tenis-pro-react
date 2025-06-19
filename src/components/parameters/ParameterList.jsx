import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getParameters,
  deleteParameter,
} from "../../services/parametersService.js";
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

export const ParameterList = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleAddClick = () => {
    navigate("/parameters/new");
  };

  const handleEditClick = (id) => {
    navigate(`/parameters/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteParameter(selectedId);
      // Recargar los datos después de la eliminación
      const updatedData = await getParameters();
      setdata(updatedData);
    } catch (error) {
      console.error("Error al eliminar el parametro:", error);
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  useEffect(() => {
    getParameters().then((data) => {
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
      renderCell: (params) => (
        <IconButton
          color="primary"
          size="small"
          onClick={() => handleEditClick(params.row.id)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "Id", flex: 1 },
    { field: "value", headerName: "Valor", flex: 1 },
    { field: "description", headerName: "Descripción", flex: 1 },
    {
      field: "modifDate",
      headerName: "Fecha modif",
      flex: 1,
      renderCell: (params) => {
        console.log("params", params);
        console.log(params.value);
        if (!params.value) return ""; // si no hay fecha, mostrar vacío
        const date = new Date(params.value);
        return new Intl.DateTimeFormat("es-ES", {
          timeZone: "UTC",
        }).format(date);
      },
    },
    { field: "modifUser", headerName: "Usuario modif", flex: 1 },
    {
      field: "delete",
      headerName: "",
      flex: 1,
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      renderCell: (params) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => handleDeleteClick(params.row.id)}
          sx={{ marginLeft: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      ),
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
          ¿Estás seguro de que deseas eliminar el parámetro?
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
