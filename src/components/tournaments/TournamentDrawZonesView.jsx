import React, { useEffect, useState } from "react";
import { getZonesDraw } from "../../services/tournamentsService";
import { useParams } from "react-router-dom";
import {MatchResultAdd} from "../matches/MatchResultAdd"
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

export const TournamentDrawZonesView = () => {
  const [zones, setZones] = useState([]);
  const { id: selectdId } = useParams();
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [openResult, setOpenResult] = useState(false);
  
  useEffect(() => {
    getZonesDraw(selectdId).then(setZones);
  }, [selectdId]);

  const getMatchResultText = (match, rowId, colId) => {
    if (!match || !match.result?.sets?.length) return "•";

    const setsText = match.result.sets
      .filter((s) => s.playerAGames  > 0 || s.playerBGames  > 0)
      .map((s) => `${s.playerAGames }-${s.playerBGames }`)
      .join(" / ");

    const winnerId = match.result.winner;

    if (rowId === winnerId) {
      return setsText; // Ganó → muestra resultado
    } else if (colId === winnerId) {
      return "X"; // Perdió → muestra "X"
    } else {
      return "•";
    }
  };

  const handleResultClick = (matchId) =>
  {
    setSelectedMatchId(matchId);
    setOpenResult(true);
  }

  const handleCloseResult = () => {
    setOpenResult(false);
    setSelectedMatchId(null);
  };

  return (
    <div style={{ padding: 10 }}>
      {zones.map((zone) => (
        <div
          key={zone.id}
          style={{
            backgroundColor: "black",
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: 18,
              textAlign: "center",
              marginBottom: 10,
              color: "white",
            }}
          >
            {zone.name}
          </h2>

          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: 5 }}></th>
                {zone.participants.map((p) => (
                  <th
                    key={p.id}
                    style={{
                      border: "1px solid #ddd",
                      padding: 5,
                      backgroundColor: "gray",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    {p.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zone.participants.map((p1) => (
                <tr key={p1.id}>
                  <td
                    style={{
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                      padding: 5,
                      backgroundColor: "gray",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      color: "white",
                    }}
                  >
                    {p1.displayName}
                  </td>
                  {zone.participants.map((p2) => {
                    if (p1.id === p2.id) {
                      return (
                        <td
                          key={p2.id}
                          style={{
                            border: "1px solid #ddd",
                            padding: 5,
                            textAlign: "center",
                            backgroundColor: "gray",
                          }}
                        >
                          -
                        </td>
                      );
                    }

                    const match = zone.matches.find(
                      (m) =>
                        (m.participant1Id === p1.id &&
                          m.participant2Id === p2.id) ||
                        (m.participant1Id === p2.id &&
                          m.participant2Id === p1.id)
                    );

                    const resultText = getMatchResultText(match, p1.id, p2.id);
                    const isWin = match?.result?.winner === p1.id;
                    const isLoss = match?.result?.winner === p2.id;

                    return (
                      <td onClick={() => handleResultClick(match.id)}
                        key={p2.id}
                        style={{
                          border: "1px solid #ddd",
                          padding: 5,
                          textAlign: "center",
                          backgroundColor: isWin
                            ? "green"
                            : isLoss
                            ? "yellow"
                            : "#fff",
                          fontWeight: isWin || isLoss ? "bold" : "normal",
                          color: isWin?"white": "gray",
                          cursor: "pointer"
                        }}
                        title={match ? `Resultado: ${resultText}` : "Pendiente"}
                      >
                        {resultText}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Modal para cargar/editar resultado */}
      <Dialog
        open={openResult}
        onClose={handleCloseResult}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Resultado del partido</DialogTitle>
        <DialogContent dividers>
          {selectedMatchId && (
            <MatchResultAdd
              matchId={selectedMatchId}
              onModalResultClose={handleCloseResult}
              onGridReload={() => getZonesDraw(selectdId).then(setZones)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResult}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
