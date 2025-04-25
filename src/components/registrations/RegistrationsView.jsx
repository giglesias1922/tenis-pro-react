import { React, useState, useEffect } from "react";
import ConfirmDialog from "../Common/ConfirmDialog.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getRegistrations,
  deleteRegistration,
} from "../../services/registrationsService";

export const RegistrationsView = ({
  tournamentId,
  onRegistrationChange,
  tournamentType,
}) => {
  const [data, setdata] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  console.log("tournamentType", tournamentType);
  useEffect(() => {
    getRegistrations(tournamentId).then((data) => {
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
      await deleteRegistration(selectedId);

      getRegistrations(tournamentId).then((data) => {
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
    { field: "userName", headerName: "Jugador", flex: 1 },
    { field: "createdAt", headerName: "Fecha Inscripción", flex: 1 },
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
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </div>
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
