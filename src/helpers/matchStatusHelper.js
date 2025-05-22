export const matchStatusMap = {
    0: "Programado",
    1: "En progreso",
    2: "Finalizado",
    3: "Suspendido",
    4: "Cancelado",
  };
  
  // Función opcional para obtener la descripción
  export const getMatchStatusText = (status) =>{
  const value = matchStatusMap[Number(status)];
  return value ?? "Desconocido";

  };