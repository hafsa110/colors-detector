import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isModifyingColor, setIsModifyingColor] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [mixedColor, setMixedColor] = useState(null);
  const [mixedR, setMixedR] = useState(null);
  const [mixedG, setMixedG] = useState(null);
  const [mixedB, setMixedB] = useState(null);
  const [mixedA, setMixedA] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setSelectedColors([]);
        setIsModifyingColor(false);
        setSelectedColorIndex(null);
        setMixedColor(null);
        setMixedR(null);
        setMixedG(null);
        setMixedB(null);
        setMixedA(null);
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

      if (isModifyingColor && selectedColorIndex !== null) {
        const newColors = [...selectedColors];
        newColors[selectedColorIndex] = rgbaColor;
        setSelectedColors(newColors);
        setIsModifyingColor(false);
      } else if (selectedColors.length < 2) {
        setSelectedColors(prevColors => [...prevColors, rgbaColor]);
        setIsModifyingColor(true);
      }
    };
  };

  const handleColorClick = (index) => {
    setSelectedColorIndex(index);
    setIsModifyingColor(true);
  };

  const handleMixColors = () => {
    if (selectedColors.length === 2) {
      // Effectuer le mélange de couleurs ici
      const color1 = selectedColors[0];
      const color2 = selectedColors[1];

      // Exemple : Calculer la moyenne des valeurs RGBA
      const mixedR = (parseInt(color1.slice(5, -1).split(',')[0], 10) + parseInt(color2.slice(5, -1).split(',')[0], 10)) / 2;
      const mixedG = (parseInt(color1.slice(5, -1).split(',')[1], 10) + parseInt(color2.slice(5, -1).split(',')[1], 10)) / 2;
      const mixedB = (parseInt(color1.slice(5, -1).split(',')[2], 10) + parseInt(color2.slice(5, -1).split(',')[2], 10)) / 2;
      const mixedA = (parseFloat(color1.slice(5, -1).split(',')[3], 10) + parseFloat(color2.slice(5, -1).split(',')[3], 10)) / 2;

      const mixedColor = `rgba(${mixedR}, ${mixedG}, ${mixedB}, ${mixedA})`;
      setMixedColor(mixedColor);
      setMixedR(mixedR);
      setMixedG(mixedG);
      setMixedB(mixedB);
      setMixedA(mixedA);
    }
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
        <button onClick={handleMixColors} disabled={selectedColors.length !== 2}>
          Mélanger les couleurs
        </button>
        {mixedColor && (
          <div className="mix-result">
            <div className="mixed-color" style={{ backgroundColor: mixedColor }} />
            <div className="percentage-box" style={{ backgroundColor: 'red', width: `${Math.round((mixedR / 255) * 100)}%` }} />
            <div className="percentage-box" style={{ backgroundColor: 'green', width: `${Math.round((mixedG / 255) * 100)}%` }} />
            <div className="percentage-box" style={{ backgroundColor: 'blue', width: `${Math.round((mixedB / 255) * 100)}%` }} />
            <div className="percentage-box" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: `${Math.round((mixedA) * 100)}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
