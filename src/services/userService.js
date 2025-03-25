import config from "../../config";
const API_URL = `${config.apiUrl}/users`;

export const getUsers = async () => {
    try {

        const response = await fetch(`${API_URL}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los usuarios`);
        }
  
        return await response.json();
        }
        catch (error) {
      console.error("Error en getUsers:", error);
      throw error;
        
    }
  };

// 🔹 Crear un usuario (Alta)
export const createUser = async (userData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al crear usuario: ${errorMessage}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error en createUser:", error);
      throw error;
    }
  };
  
  // 🔹 Obtener un usuario por ID
  export const getUserById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener usuario`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en getUserById:", error);
      throw error;
    }
  };
  
  // 🔹 Actualizar usuario (Editar)
  export const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error(`Error al actualizar usuario`);
      }
  
      
    } catch (error) {
      console.error("Error en updateUser:", error);
      throw error;
    }
  };
  
  // 🔹 Eliminar usuario
  export const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar usuario`);
      }
  
    } catch (error) {
      console.error("Error en deleteUser:", error);
      throw error;
    }
  };