import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/registrations`;

export const getRegistrations = async (tournamentId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/tournament/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getRegistrations:", error);
      throw error;
    }
};

export const getRegistratedUsers = async (tournamentId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getRegistratedUsers:", error);
      throw error;
    }
};

export const getUsersToRegistration = async (categoryId, tournamentId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${categoryId}/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getUsersToRegistration:", error);
      throw error;
    }
};

export const deleteRegistration = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteRegistration:", error);
      throw error;
    }
};

export const getRegistrationById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener la inscripción`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en getRegistrationById:", error);
      throw error;
    }
  };

export const createRegistration = async (data) => {
    try {
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error en createRegistration:", error);
      throw error;
    }
};