import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

export const imageUploadHelper = (file) => {
  const cld = new Cloudinary({ cloud: { cloudName: 'dkbhpq0zh' } });
  
  // Use this sample image or upload your own via the Media Explorer
  const img = cld
        .image(file)
        .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

  return (<AdvancedImage cldImg={img}/>);
};

export async function uploadImageToCloudinary(file, publicId) {
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