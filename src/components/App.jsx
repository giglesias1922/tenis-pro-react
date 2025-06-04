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

import { AlertSuccess } from "./Common/AlertSuccess.jsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const App = () => {
  return (
    <div>
      <AlertSuccess />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <HeaderBar />
        <Routes>
          <Route path="/" element={<Home />} />{" "}
          <Route path="/*" element={<Home />} />{" "}
          {/* Página principal por defecto */}
          <Route path="/users" element={<UsersList />} />{" "}
          <Route path="/users/:id" element={<UserAdd />} />{" "}
          {/* Ruta para categorias */}
          <Route path="/categories" element={<CategoriesList />} />{" "}
          <Route path="/categories/new" element={<CategoriesAdd />} />
          <Route path="/categories/:id" element={<CategoriesAdd />} />{" "}
          {/* Ruta para torneos */}
          <Route path="/tournaments" element={<TournamentsList />} />
          <Route path="/tournaments/new" element={<TournamentsAdd />} />
          <Route path="/tournaments/:id" element={<TournamentsAdd />} />{" "}
          {/* Ruta para registrations */}
          <Route path="/registrations" element={<RegistrationsAdd />} />
          {/* Ruta para matches */}
          <Route path="/matches" element={<MatchesList />} />
          <Route path="/matches/new" element={<MatchesAdd />} />
          <Route path="/matches/:id" element={<MatchesAdd />} />{" "}
          {/* Para editar */}
          <Route path="/login" element={<Login />} /> {/* Para editar */}
          <Route path="/register" element={<Register />} />{" "}
          <Route path="resetpassword" element={<ResetPasswordRequest />} />{" "}
        </Routes>
      </ThemeProvider>
    </div>
  );
};
