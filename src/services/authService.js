import config from "../../config";
import axiosInstance from './axiosConfig';

const API_URL = `${config.apiUrl}/auth`;

export const AuthErrorEnum = {
  UserNotFound: 1,
  InvalidCredentials: 2,
  UserDisabled: 3,
  AccountLocked: 4,
  Unauthorized: 5
};

export const loginUser = async (email, password) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, {
        Email: email,
        Password: password
      });
      
      return { success: true, token: response.data.token };
    } catch (error) {
      if (error.response) {
        if (error.response.data.errorCode === AuthErrorEnum.InvalidCredentials) {
          throw error;
        }
        return { 
          success: false, 
          errorCode: error.response.data.errorCode, 
          errorDescription: error.response.data.errorDescription 
        };
      }
      throw new Error(error.message || "Error de red");
    }
};

export const ResentActivationEmail = async (user) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/ResentActivationEmail`, user);
      return response.data.token;
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
};

export const register = async (user) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/register`, user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Error en registro");
    }
};

export const activateAccount = async (token) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/activate?token=${token}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Error en activación");
    }
};

export const resetPasswordRequest = async (email) => {
    try {
      const frontendUrl = window.location.origin;
      const payload = {
        Email: email,
        RedirectUrl: `${frontendUrl}/reset-password-form`
      };
      
      const response = await axiosInstance.put(`${API_URL}/ResetPasswordRequest`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Error en solicitud de reseteo");
    }
};

export const validateResetToken = async (token) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/ValidateResetPasswordToken?token=${token}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Error en validación de token");
    }
};

export const changePassword = async (user) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/ChangePassword`, user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Error en cambio de contraseña");
    }
};