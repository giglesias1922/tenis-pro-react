import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import {
  createParameter,
  updateParameter,
  getParameterById,
} from "../../services/parametersService";
import { IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";

export const ParameterAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== "new" && id !== undefined;

  const { formData, setFormData, handleChange, resetForm, resetFields } =
    useForm({
      id: "",
      value: "",
      description: "",
    });

  const [errors, setErrors] = useState({
    id: "",
    value: "",
    description: "",
    general: "",
  });

  useEffect(() => {
    if (isEdit) {
      getParameterById(id).then((data) => {
        setFormData({
          id: data.id || "",
          value: data.value || "",
          description: data.description || "",
        });
      });
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id) {
      newErrors.id = "El Id es obligatorio";
    }

    if (!formData.value) {
      newErrors.value = "El valor es obligatorio";
    }

    if (!formData.description) {
      newErrors.description = "La descripción es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      id: formData.id,
      value: formData.value,
      description: formData.description,
    };

    try {
      var response = null;

      if (isEdit) {
        response = await updateParameter(id, data);
      } else {
        response = await createParameter(data);
      }

      if (!response.success) {
        setErrors({ general: response.message });
        return;
      }

      navigate("/parameters");
    } catch (error) {
      console.error("Error al guardar el parámetro:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/parameters");
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 4, position: "relative" }}
      >
        <Typography variant="h5" gutterBottom>
          {isEdit ? "Edición de configuración" : "Nueva configuración"}
        </Typography>

        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton color="error" onClick={handleBackClick}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={isEdit}
              />
              {errors.id && <FormHelperText error>{errors.id}</FormHelperText>}
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Valor"
                name="value"
                value={formData.value}
                onChange={handleChange}
              />
              {errors.value && (
                <FormHelperText error>{errors.value}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <FormHelperText error>{errors.description}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              {errors.general && (
                <FormHelperText error sx={{ textAlign: "center" }}>
                  {errors.general}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
