import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  SingleEliminationBracket,
  Match,
  SVGViewer,
  createTheme,
} from "@g-loot/react-tournament-brackets";

import { getTournamentDraws } from "../../services/tournamentsService";

export const TournamentDrawView = () => {
  const { id: tournamentId } = useParams();
  const [drawType, setDrawType] = useState("main");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!tournamentId) return;

    getTournamentDraws(tournamentId)
      .then((data) => {
        const bracket =
          drawType === "main" ? data.mainBracket : data.silverCupBracket;

        if (!bracket) {
          setMatches([]);
          return;
        }

        const mappedMatches = mapBracketToMatches(bracket.rounds);
        setMatches(mappedMatches);
      })
      .catch(console.error);
  }, [tournamentId, drawType]);

  const mapBracketToMatches = (rounds) => {
    const matches = [];
    let matchIndex = 1;

    rounds.forEach((round, roundIdx) => {
      round.matches.forEach((matchId) => {
        matches.push({
          id: matchId,
          name: `Match ${matchIndex++}`,
          nextMatchId: findNextMatchId(rounds, roundIdx, matchId),
          tournamentRoundText: round.name,
          startTime: new Date().toISOString(),
          state: "SCHEDULED",
          participants: [
            {
              id: `${matchId}-p1`,
              name: `Player 1`,
              isWinner: false,
              resultText: "",
              status: "PLAYED",
            },
            {
              id: `${matchId}-p2`,
              name: `Player 2`,
              isWinner: false,
              resultText: "",
              status: "PLAYED",
            },
          ],
        });
      });
    });

    return matches;
  };

  const findNextMatchId = (rounds, currentRoundIndex, matchId) => {
    if (currentRoundIndex + 1 >= rounds.length) return null;

    const matchIndex = rounds[currentRoundIndex].matches.indexOf(matchId);
    const nextRound = rounds[currentRoundIndex + 1];

    return nextRound.matches[Math.floor(matchIndex / 2)] || null;
  };

  return (
    <div className="draw-view">
      <h2>Draw del Torneo</h2>
      <select
        value={drawType}
        onChange={(e) => setDrawType(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <option value="main">Main Draw</option>
        <option value="silvercup">Silver Cup</option>
      </select>

      {matches.length > 0 ? (
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}
          svgWrapper={SVGViewer}
          theme={createTheme()}
        />
      ) : (
        <p>No hay draw disponible</p>
      )}
    </div>
  );
};
