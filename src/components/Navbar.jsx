import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Para navegar entre páginas
  const { isAuthenticated, user, logout } = useContext(UserContext);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAuth = () => {
    if (isAuthenticated) logout();
    else handleNavigation("/login");
  };

  // Función para redirigir a las rutas
  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose(); // Cierra el menú después de hacer clic
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Menú a la izquierda */}
        <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleNavigation("/")}>Home</MenuItem>
          <MenuItem onClick={() => handleNavigation("/users")}>
            Usuarios
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/categories")}>
            Categorías
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/tournaments")}>
            Torneos
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/registrations")}>
            Inscripciones
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/matches")}>
            Partidos
          </MenuItem>
        </Menu>

        {/* Espacio flexible para centrar el título */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          My Tournament App
        </Typography>

        {isAuthenticated && user ? (
          <Avatar
            alt={user.name}
            src={user.image}
            sx={{ width: 32, height: 32, marginRight: 1 }}
          />
        ) : (
          <Button color="inherit" onClick={handleAuth}>
            Ingresar
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
