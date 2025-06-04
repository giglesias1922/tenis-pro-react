import config from "../../config";
const API_URL = `${config.apiUrl}/locations`;
import {authorizedFetch} from "../helpers/fetchHelper.js"

export const getLocations = async () => {
    try {

        const response = await authorizedFetch(`${API_URL}`,{ method: "GET" });
        
        if (!response.ok) {
            throw new Error(`Error al obtener las sedes`);
        }
  
        return await response.json();
        }
        catch (error) {
      console.error("Error en getLocations:", error);
      throw error;
        
    }
  };

  // 🔹 Eliminar sede
  export const deleteLocation = async (id) => {
    try {
      const response = await authorizedFetch(`${API_URL}/${id}`, {method: "DELETE"});
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la sede`);
      }
  
    } catch (error) {
      console.error("Error en deleteLocation:", error);
      throw error;
    }
  };

  // 🔹 Crear una sede (Alta)
export const createLocation = async (data) => {
  try {
    const response = await authorizedFetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear la sede: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createLocation:", error);
    throw error;
  }
};

// 🔹 Obtener un sede por ID
export const getLocationById = async (id) => {
  try {
    const response = await authorizedFetch(`${API_URL}/${id}`,{method:"GET"});

    if (!response.ok) {
      throw new Error(`Error al obtener la sede`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en getLocationById:", error);
    throw error;
  }
};

// 🔹 Actualizar sede (Editar)
export const updateLocation = async (id, data) => {
  try {
    const response = await authorizedFetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar sede`);
    }

    
  } catch (error) {
    console.error("Error en updateLocation:", error);
    throw error;
  }
};