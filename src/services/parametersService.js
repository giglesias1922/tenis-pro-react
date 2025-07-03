import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/parameters`;

export const getParameters = async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error en getParameters:", error);
      throw error;
    }
};

export const createParameter = async (param) => {
    try {
      const response = await axiosInstance.post(API_URL, param);
      
      if (!response.status) {
        // Error HTTP, algo salió mal en el servidor
        throw new Error(response.data.message || 'Error inesperado');
      }

      return response.data;
    } catch (error) {
      console.error("Error en createParam:", error);
      throw error;
    }
};

// 🔹 Obtener un usuario por ID
export const getParameterById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getParamById:", error);
      throw error;
    }
};

export const deleteParameter = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteParam:", error);
      throw error;
    }
};

export const updateParameter = async (id, param) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, param);
    return response.data;
  } catch (error) {
    console.error("Error en updateParameter:", error);
    throw error;
  }
};