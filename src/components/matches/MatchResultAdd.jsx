import { useEffect, useState } from "react";
import SportsTennisIcon from "@mui/icons-material/SportsTennis"; // Importamos el ícono
import {
  Box,
  Container,
  Avatar,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getMatchById, addResult } from "../../services/matchesService";
import { showMessage } from "../Common/AlertMessage";

export const MatchResultAdd = ({
  matchId,
  onModalResultClose,
  onGridReload,
}) => {
  const [match, setMatch] = useState(null);
  const [sets, setSets] = useState([
    { playerA_games: "", playerB_games: "", tiebreak: "", winnerSet: "" },
    { playerA_games: "", playerB_games: "", tiebreak: "", winnerSet: "" },
    { playerA_games: "", playerB_games: "", tiebreak: "", winnerSet: "" },
  ]);

  const [errors, setErrors] = useState({
    general: "",
    sets: ["", "", ""], // Uno por set
  });

  useEffect(() => {
    if (matchId) {
      getMatchById(matchId).then((data) => {
        setMatch(data);
      });
    }
  }, [matchId]);

  const handleSetChange = (index, player, value) => {
    const newSets = [...sets];
    newSets[index][player] = value;
    setSets(newSets);
  };

  const validateSet = (a, b) => {
    // Si alguno no tiene al menos 6, no puede haber set válido
    if (a < 6 && b < 6) return false;

    const diff = Math.abs(a - b);

    // No puede haber empate
    if (a === b) return false;

    // Si uno llegó a 6 y el otro tiene 4 o menos, es válido
    if ((a === 6 && b <= 4) || (b === 6 && a <= 4)) return true;

    // Si uno tiene 7 y el otro 5 o 6 (tie-break), también es válido
    if ((a === 7 && (b === 5 || b === 6)) || (b === 7 && (a === 5 || a === 6)))
      return true;

    return false;
  };

  const validateMatch = () => {
    if (!match) {
      setErrors("No se encontró información del partido.");
      return null;
    }

    const wins = { [match.participant1Id]: 0, [match.participant2Id]: 0 };

    const newErrors = { general: "", sets: ["", "", ""] };

    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      const a = parseInt(set.playerA_games);
      const b = parseInt(set.playerB_games);

      if (isNaN(a) || isNaN(b)) continue;

      var resul = validateSet(a, b);

      if (!resul) {
        newErrors.general = `Los games del jugador A y B del set ${
          i + 1
        } son incorrectos`;
        newErrors.sets[i] = "Set inválido";
        setErrors(newErrors);
        return null;
      }

      if (a > b) {
        wins[match.participant1Id]++;
        sets[i].winnerSet = match.participant1Id;
      } else {
        wins[match.participant2Id]++;
        sets[i].winnerSet = match.participant2Id;
      }
    }

    const winnerId =
      wins[match.participant1Id] > wins[match.participant2Id]
        ? match.participant1Id
        : wins[match.participant2Id] > wins[match.participant1Id]
        ? match.participant2Id
        : null;

    if (!winnerId || wins[winnerId] < 2) {
      setErrors({
        general: "El resultado no es válido o no hay un ganador claro.",
        sets: [],
      });
      return null;
    }

    setErrors("");
    return winnerId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const winnerId = validateMatch();

    if (winnerId === null) return;

    const result = {
      winner: winnerId,
      sets: sets.map((s) => ({
        playerA_games:
          s.playerA_games?.trim() !== "" ? parseInt(s.playerA_games) : 0,
        playerB_games:
          s.playerB_games?.trim() !== "" ? parseInt(s.playerB_games) : 0,
        tiebreak: s.tiebreak?.trim() !== "" ? s.tiebreak : null,
        winnerSet: s.winnerSet,
      })),
    };
    try {
      await addResult(matchId, result);

      showMessage("Resultado guardado con éxito ✅", "success");
      
      onGridReload();       // refresca tabla padre
      onModalResultClose();
    } catch (error) {
      console.error("Error al guardar resultado:", error);
      showMessage("Ocurrió un error ❌", "error");
    }
  };

  if (!match) return <Typography>Cargando partido...</Typography>;

  return (
    <Container>
      <Typography>
        <strong>Torneo:</strong> {match.tournamentDescription}
      </Typography>
      <Typography>
        <strong>Categoría:</strong> {match.categoryDescription}
      </Typography>
      <Typography>
        <strong>Sede:</strong> {match.locationDescription}
      </Typography>

      <TableContainer>
        <Table align="center" sx={{ width: "80%", border: "0 px" }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">
                <Avatar
                  src="https://via.placeholder.com/100"
                  sx={{ width: 80, height: 80, mx: "auto" }}
                />
                <Typography variant="subtitle1" align="center">
                  {match.playerAName}
                </Typography>
              </TableCell>
              {/* Icono de tenis entre los dos jugadores */}
              <TableCell align="center">
                <SportsTennisIcon sx={{ fontSize: 40, color: "#A4C639" }} />
              </TableCell>
              <TableCell align="center">
                <Avatar
                  src="https://via.placeholder.com/100"
                  sx={{ width: 80, height: 80, mx: "auto" }}
                />
                <Typography variant="subtitle1" align="center">
                  {match.playerBName}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {sets.map((_, index) => (
              <TableRow key={index}>
                <TableCell align="center">Set {index + 1}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    onChange={(e) =>
                      handleSetChange(index, "playerA_games", e.target.value)
                    }
                    inputProps={{
                      min: 0,
                      max: 7,
                      style: { textAlign: "center" },
                    }}
                    sx={{ width: 60 }}
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    onChange={(e) =>
                      handleSetChange(index, "playerB_games", e.target.value)
                    }
                    inputProps={{
                      min: 0,
                      max: 7,
                      style: { textAlign: "center" },
                    }}
                    sx={{ width: 60 }}
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      type="text"
                      size="small"
                      placeholder="7-5"
                      onChange={(e) =>
                        handleSetChange(index, "tiebreak", e.target.value)
                      }
                      sx={{ width: 80 }}
                      inputProps={{ style: { textAlign: "center" } }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      TB
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {errors?.general && (
        <Typography color="error" mt={2} align="center">
          {errors.general}
        </Typography>
      )}

      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
        >
          Guardar Resultado
        </Button>
      </Box>
    </Container>
  );
};
