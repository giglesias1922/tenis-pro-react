import axios from 'axios';
import { UserContext } from '../context/UserContext';
import config from '../../config';


// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lista de rutas que no requieren token (sin el prefijo de la API)
const publicRoutes = [
    { path: '/api/tournaments', method: 'GET' },
    { path: '/api/tournaments/', method: 'GET' },
  { path: '/api/locations', method: 'GET' },
  { path: '/api/locations/', method: 'GET' }, // Para rutas con parámetros
  { path: '/api/auth/login', method: 'POST' },
  { path: '/api/auth/activate', method: 'POST' },
  { path: '/api/auth/register', method: 'POST' },
  { path: '/api/auth/reset-password', method: 'POST' },
  { path: '/api/auth/verify-email', method: 'GET' },
  { path: '/api/auth/refresh-token', method: 'POST' }
];

// Función para verificar si una ruta es pública
const isPublicRoute = (url, method) => {
  if (!url) return false;
  
  // Remover query params si existen
  const path = url.split('?')[0].toLowerCase();
  
  
  // Verificar si la ruta coincide con alguna ruta pública
  const isPublic = publicRoutes.some(route => {
    const routePath = route.path.toLowerCase();
    
    // Para rutas con parámetros, verificamos si la ruta base coincide
    const isBaseMatch = path === routePath || 
                       path.startsWith(routePath) || 
                       (routePath.endsWith('/') && path.startsWith(routePath.slice(0, -1)));
    
    const matches = isBaseMatch && method.toUpperCase() === route.method;
    
    
    return matches;
  });
  
  return isPublic;
};

// Interceptor para agregar el token solo cuando sea necesario
axiosInstance.interceptors.request.use(
  (config) => {
    // Log temporal para ver la configuración de la petición
    
    // No agregar token para rutas públicas
    if (isPublicRoute(config.url, config.method)) {
      // Asegurarse de que no haya token en las rutas públicas
      delete config.headers.Authorization;
      return config;
    }

    // Agregar token para rutas que lo requieren
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores HTTP
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (200-299), la devolvemos sin modificar
    return response;
  },
  async (error) => {
    // Si no hay error.response, no es un error de la API
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const isPublic = isPublicRoute(error.config?.url, error.config?.method);
    const isInvalidCredentials = data?.errorCode === 2;

    // Manejar diferentes códigos de estado HTTP
    switch (status) {
      case 401:
        // Solo redirigir si NO es una ruta pública y NO son credenciales inválidas
        if (!isPublic && !isInvalidCredentials) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        break;
      
      case 400:
      case 403:
      case 404:
      case 500:
      case 502:
      case 503:
        // Para todos los otros errores HTTP, mostrar mensaje genérico
        if (!isPublic) {
          // Crear un evento personalizado para mostrar el mensaje de error
          const errorEvent = new CustomEvent('showError', {
            detail: {
              message: 'Se ha producido un error. Contacte al administrador del sistema.'
            }
          });
          window.dispatchEvent(errorEvent);
        }
        break;
      
      default:
        // Para cualquier otro código de estado, mostrar mensaje genérico
        if (!isPublic) {
          const errorEvent = new CustomEvent('showError', {
            detail: {
              message: 'Se ha producido un error. Contacte al administrador del sistema.'
            }
          });
          window.dispatchEvent(errorEvent);
        }
        break;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 