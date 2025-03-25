import config from "../../config";
const API_URL = `${config.apiUrl}/categories`;

export const getCategories = async () => {
    try {

        const response = await fetch(`${API_URL}`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener las categorias`);
        }
  
        return await response.json();
        }
        catch (error) {
      console.error("Error en getCategories:", error);
      throw error;
        
    }
  };

  // 🔹 Eliminar usuario
  export const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la categoría`);
      }
  
    } catch (error) {
      console.error("Error en deleteCategory:", error);
      throw error;
    }
  };

  // 🔹 Crear un Category (Alta)
export const createCategory = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear categoría: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createCategory:", error);
    throw error;
  }
};

// 🔹 Obtener un usuario por ID
export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener categoría`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en getCategoryById:", error);
    throw error;
  }
};

// 🔹 Actualizar usuario (Editar)
export const updateCategory = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar categoría`);
    }

    
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};