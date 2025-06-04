import config from "../../config";
const API_URL = `${config.apiUrl}/profiles`;
import {authorizedFetch} from "../helpers/fetchHelper.js"

export const getProfiles = async () => {
    try {

        const response = await authorizedFetch(`${API_URL}`,{method: "GET"});
        
        if (!response.ok) {
            throw new Error(`Error al obtener los perfiles`);
        }
  
        return await response.json();
        }
        catch (error) {
      console.error("Error en getProfiles:", error);
      throw error;
        
    }
  };