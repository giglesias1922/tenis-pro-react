export async function uploadImageToCloudinary(file, publicId) {

    
    try{
    // Configura estos valores con los de tu cuenta de Cloudinary
    const cloudName = 'dkbhpq0zh'; // <-- Cambia esto
    const uploadPreset = 'img_direct_upload'; // <-- Cambia esto
  
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    if (publicId) formData.append('public_id', publicId);
  
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Error al subir la imagen a Cloudinary');
    }
  
    const data = await response.json();
    return data.secure_url; // URL pública de la imagen
}
catch(error){
console.log("error:", error)
  }
}