import config from "../../config";
const API_URL = `${config.apiUrl}/matches`;
import {authorizedFetch} from "../helpers/fetchHelper.js"


export const getMatches = async () => {
    try {

        const response = await authorizedFetch(`${API_URL}`,{method:"GET"});
        
        if (!response.ok) {
            throw new Error(`Error al obtener los matches`);
        }
        
        const data = await response.json();

        return data;
        }
        catch (error) {
      console.error("Error en getMatches:", error);
      throw error;
        
    }
  };

  // 🔹 Eliminar usuario
  export const deleteMatch = async (id) => {
    try {
      const response = await authorizedFetch(`${API_URL}/${id}`, {
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
    const response = await authorizedFetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear el match: ${errorMessage}`);
    }

  } catch (error) {
    console.error("Error en createMatch:", error);
    throw error;
  }
};

// 🔹 Obtener un usuario por ID
export const getMatchById = async (id) => {
  try {
    const response = await authorizedFetch(`${API_URL}/${id}`,{method:"GET"});

    if (!response.ok) {
      throw new Error(`Error al obtener el match`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en getMatchById:", error);
    throw error;
  }
};


export const getMatchHistory = async (id) => {
  try {
    
    const response = await authorizedFetch(`${API_URL}/${id}/history`,{method:"GET"});

    if (!response.ok) {
      throw new Error(`Error al obtener la historia del match`);
    }

    const data = await response.json();
    console.log("getMatchHistory",data);
    return data;
  } catch (error) {
    console.error("Error en getMatchHistory:", error);
    throw error;
  }
};


// 🔹 Actualizar usuario (Editar)
export const updateMatch = async (id, data) => {
  try {
    const response = await authorizedFetch(`${API_URL}/${id}`, {
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

export const addResult = async (id, data) => {
  console.log("data",data)
  try {
    const response = await authorizedFetch(`${API_URL}/${id}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al cargar resultado al match`);
    }

    
  } catch (error) {
    console.error("Error en addResult:", error);
    throw error;
  }
};