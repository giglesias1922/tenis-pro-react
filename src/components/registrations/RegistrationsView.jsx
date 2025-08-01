import { React, useState, useEffect } from "react";
import ConfirmDialog from "../Common/ConfirmDialog.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PersonIcon from "@mui/icons-material/Person";
import {
  deleteParticipant,
  getParticipants,
} from "../../services/tournamentsService.js";

export const RegistrationsView = ({
  tournamentId,
  onRegistrationChange,
  tournamentDescription,
}) => {
  const [data, setdata] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    getParticipants(tournamentId).then((data) => {
      setdata(data);
      console.log(data);
    });
  }, [tournamentId]);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteParticipant(tournamentId, selectedId);

      getParticipants(tournamentId).then((data) => {
        setdata(data);
      });

      if (onRegistrationChange) {
        onRegistrationChange(); // 🔁 Actualiza la lista de jugadores
      }

      setOpenConfirm(false);
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error);
    }
  };

  // Columnas de la grilla
  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            <PersonIcon />
          </Avatar>
        </Box>
      ),
    },
    { field: "displayName", headerName: "Jugador", flex: 1 },
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
    <>
      <Container>
        {tournamentDescription && (
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Inscripciones - {tournamentDescription}
          </Typography>
        )}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            pagination={false}
            disableSelectionOnClick
            hideFooterPagination={true}
            hideFooter={true}
          />
        </div>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Cantidad de inscriptos: {data.length}
          </Typography>
        </Box>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar inscripción"
        message="¿Estás seguro de que querés eliminar este registro?"
      />
    </>
  );
};
