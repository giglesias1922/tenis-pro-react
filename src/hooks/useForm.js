import { useState } from "react";

const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target; // Extraemos el nombre y el valor del campo
    setFormData((prevState) => ({
      ...prevState, // Copiamos el estado anterior
      [name]: value, // Actualizamos solo el campo que ha cambiado
    }));
  };

  // Función para resetear el formulario
  const resetForm = (newState = initialState) => {
    setFormData(newState);
  };

  const resetFields = (fields = []) => {
    setFormData((prevState) => {
      const updated = { ...prevState };
      fields.forEach((field) => {
        updated[field] = initialState[field] ?? ""; // Usamos el valor inicial o cadena vacía
      });
      return updated;
    });
  };

  return { formData, setFormData, handleChange, resetForm, resetFields };
};

export default useForm;
