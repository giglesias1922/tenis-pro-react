import { ConnectingAirportsOutlined } from "@mui/icons-material";
import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/tournaments`;

export const getTournaments = async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error en getTournaments:", error);
      throw error;
    }
};

export const getTournamentTypes = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/tournament-types`);
      return response.data;
    } catch (error) {
      console.error("Error en getTournamentTypes:", error);
      throw error;
    }
};

export const getTournamentsBoard = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/board`);
    return response.data;
  } catch (error) {
    console.error("Error en getTournamentsBoard:", error);
    throw error;
  }
};


export const getTournamentStatus = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/tournament-status`);
      return response.data;
    } catch (error) {
      console.error("Error en getTournamentStatus:", error);
      throw error;
    }
};

export const GetTournamentsToProgramming = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/to-programming`);
      return response.data;
    } catch (error) {
      console.error("Error en GetTournamentsToProgramming:", error);
      throw error;
    }
};

export const getTournamentsToRegistration = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/open-registrations`);
      return response.data;
    } catch (error) {
      console.error("Error en getTournamentsToRegistration:", error);
      throw error;
    }
};

export const deleteTournament = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error en deleteTournament:", error);
      throw error;
    }
};

export const createTournament = async (data) => {
    try {
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error en createTournament:", error);
      throw error;
    }
};

export const getTournamentById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getTournamentById:", error);
      throw error;
    }
};

export const updateTournament = async (id, data) => {
    try {
      await axiosInstance.put(`${API_URL}/${id}`, data);
    } catch (error) {
      console.error("Error en updateTournament:", error);
      throw error;
    }
};

export const closeRegistrations = async (tournamentId) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/${tournamentId}/close-registrations`);
      return response.data;
    } catch (error) {
      console.error("Error en closeRegistrations:", error);
      throw error;
    }
};

export const generateDraw = async (tournamentId) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/${tournamentId}/generate-draw`);
      return response.data;
    } catch (error) {
      console.error("Error en generateDraw:", error);
      throw error;
    }
};