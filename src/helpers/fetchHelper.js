export const authorizedFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
  
    const defaultHeaders = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    };
  
    const config = {
      ...options,
      headers: defaultHeaders,
      credentials: "include",
    };
  
    return fetch(url, config);
  };

  
  