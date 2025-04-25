import config from "../../config";
const API_URL = `${config.apiUrl}/matches`;

export const getMatches = async () => {
    try {

        const response = await fetch(`${API_URL}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los matches`);
        }
  
        return await response.json();
        }
        catch (error) {
      console.error("Error en getMatches:", error);
      throw error;
        
    }
  };

  // 🔹 Eliminar usuario
  export const deleteMatch = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar el match`);
      }
  
    } catch (error) {
      console.error("Error en deleteMatch:", error);
      throw error;
    }
  };

  // 🔹 Crear un Category (Alta)
export const createMatch= async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear el match: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createMatch:", error);
    throw error;
  }
};

// 🔹 Obtener un usuario por ID
export const getMatchById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener el match`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en getMatchById:", error);
    throw error;
  }
};

// 🔹 Actualizar usuario (Editar)
export const updateMatch = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el match`);
    }

    
  } catch (error) {
    console.error("Error en updateMatch:", error);
    throw error;
  }
};