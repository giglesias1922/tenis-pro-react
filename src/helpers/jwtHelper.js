import {jwtDecode} from "jwt-decode";


export const parseJwt = (token) =>{
    try {
        const decoded = jwtDecode(token);

        return decoded;
        
    } catch {
      return null;
    }
  };