import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green, grey } from "@mui/material/colors";
import HideSourceIcon from "@mui/icons-material/HideSource";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { getUsers, deleteUser } from "../../services/userService.js";

export const UsersList = () => {
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleAddClick = () => {
    navigate("/users/new"); // Redirige a la ruta del componente UserNew
  };

  const handleEditClick = (id) => {
    navigate(`/users/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      // Recargar los datos después de la eliminación
      const updatedData = await getUsers();
      setdata(updatedData);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    } finally {
      setOpenConfirm(false);
      setSelectedUserId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    getUsers().then(setdata);
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
        <>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon />
          </IconButton>
        </>
      ),
    },

    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Apellido",
      flex: 1,
    },
    {
      field: "phone1",
      headerName: "Teléfono",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "active",
      headerName: "Activo",
      flex: 1,
      align: "center",
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{ color: green[500] }} />
        ) : (
          <HideSourceIcon sx={{ color: grey[500] }} />
        ),
    },
    {
      field: "delete",
      headerName: "",
      flex: 1,
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      renderCell: (params) => (
        <>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
            sx={{ marginLeft: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </>
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
          Usuarios
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
          ¿Estás seguro de que deseas eliminar este usuario?
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
