// ImageUploader.js
import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setSelectedColor(null); // Reset selected color when a new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      const pixelData = context.getImageData(x, y, 1, 1).data;
      const rgbaColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
      setSelectedColor(rgbaColor);
    };
  };

  return (
    <div className="image-uploader">
      <div className="image-section">
        <label htmlFor="upload-input" className="upload-label">
          Sélectionner une image
        </label>
        <input
          type="file"
          id="upload-input"
          onChange={handleImageChange}
          accept="image/*"
        />
        <div className="image-container" onClick={handleImageClick}>
          {image && (
            <img src={image} alt="Uploaded" className="uploaded-image" />
          )}
        </div>
      </div>
      <div className="color-section">
        {selectedColor && (
          <div className="selected-color" style={{ backgroundColor: selectedColor }} />
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
