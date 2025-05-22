import config from "../../config";
const API_URL = `${config.apiUrl}/registrations`;

export const getRegistrations = async (tournamentId) => {
    try {

        const response = await fetch(`${API_URL}/tournament/${tournamentId}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los torneos`);
        }

        return await response.json();
        }
        catch (error) {
      console.error("Error en getRegistrations:", error);
      throw error;
        
    }
  };

  export const  getRegistratedUsers = async (tournamentId) => {
    try {
      const response = await fetch(`${API_URL}/users/${tournamentId}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener los jugadores inscriptos`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en getRegistratedUsers:", error);
      throw error;
    }
  };  

  export const  getUsersToRegistration = async (categoryId, tournamentId) => {
    try {
      const response = await fetch(`${API_URL}/${categoryId}/${tournamentId}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener los usuarios no registrados`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en getUsersToRegistration:", error);
      throw error;
    }
  };  

  // 🔹 Eliminar torneo
  export const deleteRegistration = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la inscripción`);
      }
  
    } catch (error) {
      console.error("Error en deleteRegistration:", error);
      throw error;
    }
  };

  export const getRegistrationById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener la inscripción`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en getRegistrationById:", error);
      throw error;
    }
  };

  // 🔹 Crear un torneo (Alta)
export const createRegistration = async (data) => {
    console.log(data);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear la inscripción: ${errorMessage}`);
    }

  } catch (error) {
    console.error("Error en createRegistration:", error);
    throw error;
  }
};