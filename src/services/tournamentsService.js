import config from "../../config";
const API_URL = `${config.apiUrl}/tournaments`;

export const getTournaments = async () => {
    try {

        const response = await fetch(`${API_URL}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los torneos`);
        }

        return await response.json();
        }
        catch (error) {
      console.error("Error en getTournaments:", error);
      throw error;
        
    }
  };

  export const GetTournamentsToProgramming = async () => {
    try {

        const response = await fetch(`${API_URL}/to-programming`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los torneos`);
        }

        return await response.json();
        }
        catch (error) {
      console.error("Error en GetTournamentsToProgramming:", error);
      throw error;
        
    }
  };
  
  export const getTournamentsToRegistration = async () => {
    try {

        const response = await fetch(`${API_URL}/open-registrations`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los torneos`);
        }

        return await response.json();
        }
        catch (error) {
      console.error("Error en getTournaments:", error);
      throw error;
        
    }
  };
  

  // 🔹 Eliminar torneo
  export const deleteTournament = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar el torneo`);
      }
  
    } catch (error) {
      console.error("Error en deleteTournament:", error);
      throw error;
    }
  };

  // 🔹 Crear un torneo (Alta)
export const createTournament = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear el torneo: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createTournament:", error);
    throw error;
  }
};

// 🔹 Obtener un torneo por ID
export const getTournamentById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener el torneo`);
    }
    
    var data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error en getTournamentById:", error);
    throw error;
  }
};

// 🔹 Actualizar torneo (Editar)
export const updateTournament = async (id, data) => {
  try {
    console.log("data",data);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el torneo`);
    }

    
  } catch (error) {
    console.error("Error en updateTournament:", error);
    throw error;
  }
};