import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Logo from "../../resources/Logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Agregado para ícono de submenú

const pages = [
  { id: 1, label: "Usuarios", path: "/users", auth: true, parentId: 5 }, //submenu
  { id: 2, label: "Torneos", path: "/tournaments", auth: true, parentId: 10 },
  {
    id: 3,
    label: "Inscripciones",
    path: "/registrations",
    auth: true,
    parentId: 10,
  },
  { id: 4, label: "Partidos", path: "/matches", auth: true, parentId: 10 },
  { id: 5, label: "Mantenimiento", path: "", auth: true },
  { id: 6, label: "Categorias", path: "/categories", auth: true, parentId: 5 }, //submenu
  { id: 7, label: "Ranking", path: "/ranking", auth: true },
  { id: 8, label: "Parámetros", path: "/parameters", auth: true, parentId: 5 },
  { id: 9, label: "Torneos", path: "/tournaments/board", auth: false }, //menu publico
  { id: 10, label: "Organización", path: "", auth: true },
];

const settings = [
  { label: "Cuenta", path: "" },
  { label: "Salir", action: "logout" },
];

const parentMenus = pages.filter((p) => !p.parentId);
const subMenus = pages.filter((p) => p.parentId);

export const HeaderBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [submenuAnchors, setSubmenuAnchors] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(UserContext);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  
  const handleOpenSubmenu = (event, parentId) => {
    setSubmenuAnchors(prev => ({
      ...prev,
      [parentId]: event.currentTarget
    }));
  };
  
  const handleCloseSubmenu = (parentId) => {
    setSubmenuAnchors(prev => ({
      ...prev,
      [parentId]: null
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
    // Cerrar todos los submenús
    setSubmenuAnchors({});
  };

  return (
    <AppBar position="static" color="default" enableColorOnDark>
      <Box sx={{ width: "100%" }}>
        <Toolbar
          disableGutters
          sx={{ minHeight: "auto", paddingY: 0, margin: 0 }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", pl: 0, ml: 0 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={Logo}
                alt="Logo"
                style={{ height: "75px", objectFit: "contain" }}
              />
            </Link>
          </Box>

          {/* Menú hamburguesa en XS */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages
                .filter((page) => (isAuthenticated && page.auth) || !page.auth)
                .map((page) => (
                  <MenuItem
                    key={page.id}
                    onClick={() => handleNavigation(page.path)}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          {/* Menú en MD+ */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {parentMenus
              .filter((page) => (isAuthenticated && page.auth) || !page.auth)
              .map((page) => {
                const children = subMenus.filter(
                  (sub) => sub.parentId === page.id
                );
                const hasSubmenu = children.length > 0;

                return hasSubmenu ? (
                  <Box key={page.id}>
                    <Button
                      onClick={(event) => handleOpenSubmenu(event, page.id)}
                      sx={{
                        my: 2,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {page.label}
                      <ArrowDropDownIcon />
                    </Button>
                    <Menu
                      anchorEl={submenuAnchors[page.id]}
                      open={Boolean(submenuAnchors[page.id])}
                      onClose={() => handleCloseSubmenu(page.id)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                      {children.map((child) => (
                        <MenuItem
                          key={child.id}
                          onClick={() => handleNavigation(child.path)}
                        >
                          {child.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                ) : (
                  <Button
                    key={page.id}
                    onClick={() => handleNavigation(page.path)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.label}
                  </Button>
                );
              })}
          </Box>

          {/* Usuario autenticado */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 0, mr: 5 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || "User"}
                    src={user?.imageUrl || "/static/images/avatar/2.jpg"}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.label}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting.action === "logout") {
                        logout();
                        navigate("/login");
                      }
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Usuario no autenticado */}
          {!isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                key="login"
                onClick={() => handleNavigation("/login")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Ingresar
              </Button>
            </Box>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
};
