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
import { TournamentsList } from "./tournaments/TournamentsList.jsx";
import { TournamentsAdd } from "./tournaments/TournamentsAdd.jsx";
import { RegistrationsAdd } from "./registrations/RegistrationsAdd.jsx";
import { MatchesList } from "./matches/MatchesList.jsx";
import { MatchesAdd } from "./matches/MatchesAdd.jsx";
import { Login } from "./login/Login.jsx";
import { Register } from "./login/Register.jsx";
import { ResetPasswordRequest } from "./login/ResetPasswordRequest.jsx";
import { ResetPassword } from "./login/ResetPassword.jsx";
import { AlertSuccess } from "./Common/AlertSuccess.jsx";
import { ErrorHandler } from "./Common/ErrorHandler.jsx";
import { Ranking } from "./ranking/Ranking.jsx";
import { ParameterList } from "./parameters/ParameterList.jsx";
import { ParameterAdd } from "./parameters/ParameterAdd.jsx";
import { TournamentBoard } from "./tournaments/TournamentBoard.jsx";
import { deepmerge } from "@mui/utils";

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
      <AlertSuccess />
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
          <Route path="/tournaments" element={<TournamentsList />} />
          <Route path="/tournaments/new" element={<TournamentsAdd />} />
          <Route path="/tournaments/:id" element={<TournamentsAdd />} />
          <Route path="/tournaments/board" element={<TournamentBoard />} />
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
