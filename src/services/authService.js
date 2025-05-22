import config from "../../config";
const API_URL = `${config.apiUrl}/auth`;

export const loginUser = async (email, password) => {
 
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password })
      });

      if (response.ok) {
        const data = await response.json();
        alert(1);
        alert(data);
        alert(data.token);
        alert(token);
        return data.token;

      } else {
        throw new Error(data.error || "Error de autenticación");
      }


    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  };

  export const register = async (user) => {

    // user es un objeto con las propiedades: Email, Password, BirthDate, CategoryId, Comment, etc.
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data; // mensaje OK o info que retorne el backend
      } else {
        throw new Error(data || "Error en registro");
      }
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  };

  export const activateAccount = async (token) => {
    try {
      const response = await fetch(`${API_URL}/activate?token=${token}`, {
        method: "GET"
      });
  
      const data = await response.text(); // retorna mensaje
  
      if (response.ok) {
        return data;
      } else {
        throw new Error(data || "Error en activación");
      }
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  };