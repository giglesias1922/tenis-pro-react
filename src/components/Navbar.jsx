import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Para navegar entre páginas

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
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
            Jugadores
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/categories")}>
            Categorías
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose}>Settings</MenuItem>
        </Menu>

        {/* Espacio flexible para centrar el título */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          My Tournament App
        </Typography>

        {/* Login/Logout a la derecha con icono */}
        <Button
          color="inherit"
          startIcon={<AccountCircleIcon />}
          onClick={handleAuth}
        >
          {isAuthenticated ? "Logout" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
