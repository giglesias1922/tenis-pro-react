import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </LocalizationProvider>
  </UserProvider>
);
