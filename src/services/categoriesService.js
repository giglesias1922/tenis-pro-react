import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/categories`;

export const getCategories = async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error en getCategories:", error);
      throw error;
    }
};

// 🔹 Eliminar usuario
export const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteCategory:", error);
      throw error;
    }
};

// 🔹 Crear un Category (Alta)
export const createCategory = async (data) => {
    try {
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error en createCategory:", error);
      throw error;
    }
};

// 🔹 Obtener un usuario por ID
export const getCategoryById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getCategoryById:", error);
      throw error;
    }
};

// 🔹 Actualizar usuario (Editar)
export const updateCategory = async (id, data) => {
    try {
      await axiosInstance.put(`${API_URL}/${id}`, data);
    } catch (error) {
      console.error("Error en updateCategory:", error);
      throw error;
    }
};