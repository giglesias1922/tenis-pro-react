import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/ranking`;

export const getRanking = async (categoryId, tournamentType, year) => {
    try {
      const response = await axiosInstance.post(API_URL, {
        categoryId: categoryId,
        tournamentType: tournamentType,
        year: year,
      });

      return response.data;
    } catch (error) {
      console.error("Error en getRanking:", error);
      throw error;
    }
};