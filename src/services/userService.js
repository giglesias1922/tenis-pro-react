import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/users`;

export const getUsers = async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error en getUsers:", error);
      throw error;
    }
};

// 🔹 Crear un usuario (Alta)
export const createUser = async (user) => {

    try {
      const response = await axiosInstance.post(API_URL, user);
      
      if (!response.status) {
        // Error HTTP, algo salió mal en el servidor
        throw new Error(response.data.message || 'Error inesperado');
      }

      return response.data;
    } catch (error) {
      console.error("Error en createUser:", error);
      throw error;
    }
};

// 🔹 Obtener un usuario por ID
export const getUserById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getUserById:", error);
      throw error;
    }
};

// 🔹 Obtener un usuario por ID
export const getUsersByCategory = async (categoryId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/Category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getUsersByCategory:", error);
      throw error;
    }
};

// 🔹 Actualizar usuario (Editar)
export const updateUser = async (id, user) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, user);
      return response.data;
    } catch (error) {
      console.error("Error en updateUser:", error);
      throw error;
    }
};

// 🔹 Eliminar usuario
export const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteUser:", error);
      throw error;
    }
};