// ImageUploader.js
import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader">
      <label htmlFor="upload-input" className="upload-label">
        Sélectionner une image
      </label>
      <input
        type="file"
        id="upload-input"
        onChange={handleImageChange}
        accept="image/*"
      />
      {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
    </div>
  );
};

export default ImageUploader;
