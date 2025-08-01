import { useState } from "react";

const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseInt(value, 10) || 0 : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: parsedValue,
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
        updated[field] = initialState[field] ?? "";
      });
      return updated;
    });
  };

  return { formData, setFormData, handleChange, resetForm, resetFields };
};

export default useForm;
