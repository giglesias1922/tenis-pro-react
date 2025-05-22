import React from 'react'

const validateForm = () =>{
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (!formData.password2) newErrors.password2 = "Confirme la contraseña";

    if (
        formData.password &&
        formData.password2 &&
        formData.password != formData.password2
      )
        newErrors.password2 = "Las contraseñas no pueden ser distintas";
  
      if (formData.password)
        newErrors.password = validatePasswordPolicy(formData.password);
  
}

const validatePasswordPolicy = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Mínimo 8 caracteres, una mayúscula y un número
    return (
      regex.test(password) ||
      "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
    );
  };

export const FirstAccess = () => {
  return (
    <>
        <Grid item sm={5}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                name="userName"
                value={formData.userName || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText>{errors.userName}</FormHelperText>
              )}
            </Grid>
            <Grid item sm={3}>
              <TextField
                type="password"
                fullWidth
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                label="Clave"
              />
              {errors.password && (
                <FormHelperText>{errors.password}</FormHelperText>
              )}
            </Grid>
            <Grid item sm={3}>
              <TextField
                type="password"
                fullWidth
                label="Confirmar la contraseña"
                value={formData.password2 || ""}
                onChange={handleChange}
              />
              {errors.password2 && (
                <FormHelperText>{errors.password2}</FormHelperText>
              )}
            </Grid>

    </>
  )
<>
  <Grid item sm={5}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                name="userName"
                value={formData.userName || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText>{errors.userName}</FormHelperText>
              )}
            </Grid>
            <Grid item sm={3}>
              <TextField
                type="password"
                fullWidth
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                label="Clave"
              />
              {errors.password && (
                <FormHelperText>{errors.password}</FormHelperText>
              )}
            </Grid>
            <Grid item sm={3}>
              <TextField
                type="password"
                fullWidth
                label="Confirmar la contraseña"
                value={formData.password2 || ""}
                onChange={handleChange}
              />
              {errors.password2 && (
                <FormHelperText>{errors.password2}</FormHelperText>
              )}
            </Grid>

</>
