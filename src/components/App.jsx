import React from "react";
import { Navbar } from "./Navbar.jsx";
import { Home } from "./Home.jsx";
import { Routes, Route } from "react-router-dom";
import { UsersList } from "./users/UsersList.jsx";
import { UsersAdd } from "./users/UsersAdd.jsx";
import { CategoriesList } from "./categories/CategoriesList.jsx";
import { CategoriesAdd } from "./categories/CategoriesAdd.jsx";
import { TournamentsList } from "./tournaments/TournamentsList.jsx";
import { TournamentsAdd } from "./tournaments/TournamentsAdd.jsx";
import { RegistrationsAdd } from "./registrations/RegistrationsAdd.jsx";

export const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        <Route path="/*" element={<Home />} />{" "}
        {/* Página principal por defecto */}
        <Route path="/users" element={<UsersList />} /> {/* Ruta para Users */}
        <Route path="/users/new" element={<UsersAdd />} />
        <Route path="/users/:id" element={<UsersAdd />} /> {/* Para editar */}
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
      </Routes>
    </div>
  );
};
