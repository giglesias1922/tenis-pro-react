import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/profiles`;

export const getProfiles = async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error en getProfiles:", error);
      throw error;
    }
};