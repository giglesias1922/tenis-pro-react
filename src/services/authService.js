import config from "../../config";
const API_URL = `${config.apiUrl}/auth`;

export const AuthErrorEnum = {
  UserNotFound: 1,
  InvalidCredentials: 2,
  UserDisabled: 3,
  AccountLocked: 4,
  Unauthorized: 5
};

export const loginUser = async (email, password) => {
  console.log(`${API_URL}/login`);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password })
      });
      console.log(response);
      const data = await response.json();

      if (response.ok) {        
        return { success: true, token: data.token };

      }      
      
      return { success: false, errorCode:  data.errorCode, errorDescription:data.errorDescription };
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  };

  export const ResentActivationEmail = async (user) =>{
    try 
    {
      const response = await fetch(`${API_URL}/ResentActivationEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
          
      if (response.ok) {
        var data = await response.json();

        return data.token;
      }
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  }

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
          
      if (response.ok) {
        const newUser = await response.json();

        return newUser; // mensaje OK o info que retorne el backend
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

  export const resetPasswordRequest = async (user) => {
    try {
      const frontendUrl = window.location.origin
      
      const response = await fetch(`${API_URL}/ResetPasswordRequest`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
  
      const data = await response.json(); // retorna mensaje
  
      if (response.ok) {
        return data;
      } else {
        throw new Error(data || "Error en activación");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  export const changePassword = async (user) => {
    try {
      const frontendUrl = window.location.origin
      
      const response = await fetch(`${API_URL}/ChangePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
  
      const data = await response.json(); // retorna mensaje
  
      if (response.ok) {
        return data;
      } else {
        throw new Error(data || "Error en activación");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };