import { React, useState, useEffect } from "react";
import ConfirmDialog from "../Common/ConfirmDialog.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { getMatchStatusText } from "../../helpers/matchStatusHelper.js";
import {
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getMatchHistory } from "../../services/matchesService";

export const MatchHistory = ({ Id }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMatchHistory(Id).then((data) => {
      // Mapeamos los datos para incluir la descripción del estado
      const dataWithStatusDescription = data.map((item) => ({
        ...item,
        statusDescription: getMatchStatusText(item.status), // Mapeo el status numérico a la descripción
      }));
      setData(dataWithStatusDescription);
    });
  }, [Id]);

  // Columnas de la grilla
  const columns = [
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      align: "Center",
      renderCell: (params) => {
        const date = new Date(params.value); // en UTC si tiene la Z
        const localDate = new Date(
          date.toLocaleString("en-US", { timeZone: "UTC" })
        );

        const day = localDate.getDate().toString().padStart(2, "0");
        const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
        const year = localDate.getFullYear();
        const hours = localDate.getHours().toString().padStart(2, "0");
        const minutes = localDate.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
      },
    },
    {
      field: "statusDescription",
      headerName: "Estado",
      flex: 1,
      align: "Center",
    },
    { field: "notes", headerName: "Nota", flex: 1 },
  ];

  return (
    <Container>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.date}
        />
      </div>
    </Container>
  );
};
