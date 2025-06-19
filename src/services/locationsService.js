import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/locations`;

export const getLocations = async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error en getLocations:", error);
      throw error;
    }
};

// 🔹 Eliminar sede
export const deleteLocation = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteLocation:", error);
      throw error;
    }
};

// 🔹 Crear una sede (Alta)
export const createLocation = async (data) => {
    try {
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error en createLocation:", error);
      throw error;
    }
};

// 🔹 Obtener un sede por ID
export const getLocationById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getLocationById:", error);
      throw error;
    }
};

// 🔹 Actualizar sede (Editar)
export const updateLocation = async (id, data) => {
    try {
      await axiosInstance.put(`${API_URL}/${id}`, data);
    } catch (error) {
      console.error("Error en updateLocation:", error);
      throw error;
    }
};