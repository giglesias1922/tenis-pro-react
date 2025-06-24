import React, { useEffect, useState } from "react";
import { getTournamentsBoard } from "../../services/tournamentsService";
import CardContent from "@mui/material/CardContent";
import {
  Grid,
  Card,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  Paper,
} from "@mui/material";

export const TournamentBoard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    var response = getTournamentsBoard().then((res) => {
      setData(res);
      console.log("data", res);
    });
  }, []);

  return (
    <Grid container spacing={2} elevation={3}>
      {data.map((tournament) => (
        <Grid item xs={12} sm={6} mt={5} md={4} key={tournament.id}>
          <Card>
            <CardMedia
              component="img"
              height="100%"
              image={tournament.image}
              alt="Tournament banner"
            />
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleOpen(tournament)}
              >
                Inscribirse
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
