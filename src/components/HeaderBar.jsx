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

const pages = [
  { label: "Users", path: "/users", auth: true },
  { label: "Categories", path: "/categories", auth: true },
  { label: "Tournaments", path: "/tournaments", auth: false },
  { label: "Registrations", path: "/registrations", auth: true },
  { label: "Matches", path: "/matches", auth: true },
];

const settings = [
  { label: "Cuenta", path: "" },
  { label: "Salir", action: "logout" },
];

export const HeaderBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(UserContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" color="default" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: "auto", paddingY: 0, margin: 0 }}
        >
          {/* Logo siempre visible */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={Logo}
                alt="Logo"
                style={{ height: "75px", objectFit: "contain" }}
              />
            </Link>
          </Box>

          {/* Menú hamburguesa para xs */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages
                .filter(
                  (page) =>
                    (isAuthenticated === true && page.auth === true) ||
                    page.auth === false
                )
                .map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => {
                      handleNavigation(page.path);
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          {/* Menú de botones para md en adelante */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages
              .filter(
                (page) =>
                  (isAuthenticated === true && page.auth === true) ||
                  page.auth === false
              )
              .map((page) => (
                <Button
                  key={page.label}
                  onClick={() => handleNavigation(page.path)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.label}
                </Button>
              ))}
          </Box>

          {/* Usuario autenticado */}
          {isAuthenticated === true && (
            <Box sx={{ flexGrow: 0 }}>
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
                id="menu-appbar-user"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
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

          {/* Usuario NO autenticado */}
          {isAuthenticated === false && (
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
      </Container>
    </AppBar>
  );
};
