import React from "react";
import { Navbar } from "./Navbar.jsx";
import { HeaderBar } from "./HeaderBar.jsx";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { DataGridTheme } from "../DataGridTheme.js";

import { Home } from "./Home.jsx";
import { Routes, Route } from "react-router-dom";
import { UsersList } from "./users/UsersList.jsx";
import { UserAdd } from "./users/UserAdd.jsx";
import { CategoriesList } from "./categories/CategoriesList.jsx";
import { CategoriesAdd } from "./categories/CategoriesAdd.jsx";
import { LocationsList } from "./locations/LocationsList.jsx";
import { LocationsAdd } from "./locations/LocationsAdd.jsx";
import { TournamentsList } from "./tournaments/TournamentsList.jsx";
import { TournamentsAdd } from "./tournaments/TournamentsAdd.jsx";
import { RegistrationsAdd } from "./registrations/RegistrationsAdd.jsx";
import { MatchesList } from "./matches/MatchesList.jsx";
import { MatchesAdd } from "./matches/MatchesAdd.jsx";
import { Login } from "./login/Login.jsx";
import { Register } from "./login/Register.jsx";
import { ResetPasswordRequest } from "./login/ResetPasswordRequest.jsx";
import { ResetPassword } from "./login/ResetPassword.jsx";
import { AlertMessage } from "./Common/AlertMessage.jsx";
import { ErrorHandler } from "./Common/ErrorHandler.jsx";
import { Ranking } from "./ranking/Ranking.jsx";
import { ParameterList } from "./parameters/ParameterList.jsx";
import { ParameterAdd } from "./parameters/ParameterAdd.jsx";
import { TournamentBoard } from "./tournaments/TournamentBoard.jsx";
import { TournamentDrawGenerator } from "./tournaments/TournamentDrawGenerator.jsx";
import { deepmerge } from "@mui/utils";
import { TournamentDrawView } from "./tournaments/TournamentDrawView.jsx";
import { TournamentDrawZonesView } from "./tournaments/TournamentDrawZonesView.jsx";

// Crear el tema base oscuro
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#90caf9",
    },
  },
});

// Combinar el tema oscuro con el tema del DataGrid
const theme = createTheme(
  deepmerge(darkTheme, { components: DataGridTheme.components })
);

export const App = () => {
  return (
    <div>
      <AlertMessage />
      <ErrorHandler />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HeaderBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserAdd />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/new" element={<CategoriesAdd />} />
          <Route path="/categories/:id" element={<CategoriesAdd />} />
          <Route path="/locations" element={<LocationsList />} />
          <Route path="/locations/new" element={<LocationsAdd />} />
          <Route path="/locations/:id" element={<LocationsAdd />} />
          <Route path="/tournaments" element={<TournamentsList />} />
          <Route path="/tournaments/new" element={<TournamentsAdd />} />
          <Route
            path="/tournaments/:id/generate-draw"
            element={<TournamentDrawGenerator />}
          />
          <Route path="/tournaments/:id" element={<TournamentsAdd />} />
          <Route path="/tournaments/board" element={<TournamentBoard />} />
          <Route
            path="/tournaments/:id/draw"
            element={<TournamentDrawView />}
          />
          <Route
            path="/tournaments/:id/zone-draw"
            element={<TournamentDrawZonesView />}
          />
          <Route path="/registrations" element={<RegistrationsAdd />} />
          <Route path="/matches" element={<MatchesList />} />
          <Route path="/matches/new" element={<MatchesAdd />} />
          <Route path="/matches/:id" element={<MatchesAdd />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<ResetPasswordRequest />} />
          <Route path="/reset-password-form" element={<ResetPassword />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/parameters" element={<ParameterList />} />
          <Route path="/parameters/:id" element={<ParameterAdd />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};
