import {jwtDecode} from "jwt-decode";


export const parseJwt = (token) =>{
    try {
        const token = "TOKEN_AQUI";
        const decoded = jwtDecode(token);

        return decoded;
        
    } catch {
      return null;
    }
  };