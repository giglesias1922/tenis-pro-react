import React from "react";
import { Navbar } from "./Navbar.jsx";
import { Home } from "./Home.jsx";
import { Routes, Route } from "react-router-dom";
import { UsersList } from "./users/UsersList.jsx";
import { UsersAdd } from "./users/UsersAdd.jsx";
import { CategoriesList } from "./categories/CategoriesList.jsx";
import { CategoriesAdd } from "./categories/CategoriesAdd.jsx";

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
        <Route path="/categories" element={<CategoriesList />} />{" "}
        {/* Ruta para Users */}
        <Route path="/categories/new" element={<CategoriesAdd />} />
        <Route path="/categories/:id" element={<CategoriesAdd />} />{" "}
        {/* Para editar */}
      </Routes>
    </div>
  );
};
