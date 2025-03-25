import config from "../../config";
const API_URL = `${config.apiUrl}/profiles`;

export const getProfiles = async () => {
    try {

        const response = await fetch(`${API_URL}`);
        
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