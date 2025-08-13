import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/matches`;

export const getMatches = async (tournamentId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error en getMatches:", error);
      throw error;
    }
};

// 🔹 Eliminar usuario
export const deleteMatch = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteMatch:", error);
      throw error;
    }
};

// 🔹 Crear un Category (Alta)
export const createMatch = async (data) => {
    try {
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error en createMatch:", error);
      throw error;
    }
};

// 🔹 Obtener un usuario por ID
export const getMatchById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getMatchById:", error);
      throw error;
    }
};

export const getMatchHistory = async (id) => {
  try {
    
    const response = await axiosInstance.get(`${API_URL}/${id}/history`);

    if (!response.ok) {
      throw new Error(`Error al obtener la historia del match`);
    }

    const data = await response.data;
    
    return data;
  } catch (error) {
    console.error("Error en getMatchHistory:", error);
    throw error;
  }
};

// 🔹 Actualizar usuario (Editar)
export const updateMatch = async (id, data) => {
    try {
      await axiosInstance.put(`${API_URL}/${id}`, data);
    } catch (error) {
      console.error("Error en updateMatch:", error);
      throw error;
    }
};

export const addResult = async (id, data) => {  
    try {
      await axiosInstance.put(`${API_URL}/${id}/result`, data);
    } catch (error) {
      console.error("Error en addResult:", error);
      throw error;
    }
};