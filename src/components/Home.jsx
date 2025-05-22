import React from "react";
import Logo from "../../resources/Logo.png";

export const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // centra horizontalmente
        alignItems: "center", // centra verticalmente
        height: "100vh", // ocupa toda la altura de la ventana
      }}
    >
      <img
        src={Logo}
        alt="Logo"
        style={{ height: 500, width: 500, margin: "0 auto" }}
      />
    </div>
  );
};
