import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setSelectedColors([]); // Réinitialiser les couleurs sélectionnées lorsqu'une nouvelle image est chargée
        setSelectedColorIndex(null);
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
      const rect = e.target.getBoundingClientRect();
      const scaleX = img.width / rect.width;
      const scaleY = img.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      const pixelData = context.getImageData(x, y, 1, 1).data;
      const rgbaColor = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;

      // Si une seule couleur est sélectionnée, choisissez celle à modifier
      if (selectedColors.length === 1 && selectedColorIndex !== null) {
        const newColors = [...selectedColors];
        newColors[selectedColorIndex] = rgbaColor;
        setSelectedColors(newColors);
      } else if (selectedColors.length < 2) {
        setSelectedColors(prevColors => [...prevColors, rgbaColor]);
      }
    };
  };

  const handleColorClick = (index) => {
    setSelectedColorIndex(index);
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
        {selectedColors.map((color, index) => (
          <div
            key={index}
            className={`selected-color ${selectedColorIndex === index ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
