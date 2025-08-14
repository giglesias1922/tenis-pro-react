import { ConnectingAirportsOutlined } from "@mui/icons-material";
import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/tournaments`;

export const getTournaments = async () => {
    try {      
      const response = await axiosInstance.get(API_URL);

      console.log("API_URL",API_URL)
      console.log("response.data",response.data)
      console.log("response.data.data",response.data.data)


      return response.data.data;
    } catch (error) {
      console.error("Error en getTournaments:", error);
      throw error;
    }
};

export const getTournamentTypes = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/tournament-types`);
      
      return response.data.data;
    } catch (error) {
      console.error("Error en getTournamentTypes:", error);
      throw error;
    }
};

export const getTournamentsBoard = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/board`);
    return response.data.data;
  } catch (error) {
    console.error("Error en getTournamentsBoard:", error);
    throw error;
  }
};

export const getTournamentDraws = async (tournamentId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${tournamentId}/draw`);
    return response.data.data; // { mainBracket, silverCupBracket }
  } catch (error) {
    console.error("Error en getTournamentDraws:", error);
    throw error;
  }
};

export const getTournamentStatus = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/tournament-status`);
      return response.data.data;
    } catch (error) {
      console.error("Error en getTournamentStatus:", error);
      throw error;
    }
};

export const GetTournamentsToProgramming = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/to-programming`);
      return response.data.data;
    } catch (error) {
      console.error("Error en GetTournamentsToProgramming:", error);
      throw error;
    }
};

export const getTournamentsToRegistration = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/open-registrations`);
      return response.data.data;
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
      return response.data.data;
    } catch (error) {
      console.error("Error en createTournament:", error);
      throw error;
    }
};

export const getTournamentById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error en getTournamentById:", error);
      throw error;
    }
};

export const getZonesDraw = async (id) => {
  
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}/zone-draw`);
    console.log("data", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error en getZonesDraw:", error);
    throw error;
  }
};


export const addParticipant = async (tournamentId, participant) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${tournamentId}/participants`,participant);     
  } catch (error) {
    console.error('Error al agregar participante:', error.response?.data || error.message);
  }
};

export const deleteParticipant = async (tournamentId, participantId) => {
  try {
    await axiosInstance.delete(`${API_URL}/${tournamentId}/participants/${participantId}`);
  } catch (error) {
    console.error('Error al eliminar participante:', error.response?.data || error.message);
  }
};

export const getParticipants = async (tournamentId) => {
  try {
    const response = await axios.get(`${API_URL}/${tournamentId}/participants`);
    return response.data.data; // array de participantes
  } catch (error) {
    console.error('Error al obtener participantes:', error);
    return [];
  }
};

export const getParticipantsToRegister = async (categoryId, tournamentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${categoryId}/${tournamentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener usuarios para registrarse:', error);
    throw error;
  }
};

export const getParticipant = async (tournamentId, participantId) => {
  try {
    const response = await axios.get(`${API_URL}/${tournamentId}/participants/${participantId}`);
    return response.data.data; // objeto del participante
  } catch (error) {
    console.error('Error al obtener el participante:', error);
    return null;
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
      return response.data.data;
    } catch (error) {
      console.error("Error en closeRegistrations:", error);
      throw error;
    }
};

export const generateDraw = async (tournamentId, config) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/${tournamentId}/generate-draw`, config);
      
      return response.data.data;
    } catch (error) {
      console.error("Error en generateDraw:", error);
      throw error;
    }
};