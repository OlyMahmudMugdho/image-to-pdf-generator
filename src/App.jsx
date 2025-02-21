import React, { useState } from 'react';
import Dropzone from './components/Dropzone.jsx';
import ImageList from './components/ImageList.jsx';
import CropModal from './components/CropModal.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

function App() {
  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 / 1 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropShape, setCropShape] = useState('rect');
  const [theme, setTheme] = useState('light');

  const handleDrop = async (acceptedFiles) => {
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload image');
        const url = await res.text();
        return {
          id: Math.random().toString(36).substr(2, 9),
          file, // Keep for cropping
          url,  // Backend URL
          cropped: null,
        };
      })
    );
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImages(reorderedImages);
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    images.forEach((image, index) => {
      if (index > 0) pdf.addPage();
      const imgData = image.cropped || image.url;
      pdf.addImage(imgData, 'JPEG', 10, 10, 190, 0);
    });
    const pdfBlob = pdf.output('blob');
    saveAs(pdfBlob, 'images.pdf');
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-base-100 rounded-box shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Image to PDF Generator</h1>
          <ThemeToggle theme={theme} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
        </div>

        <Dropzone onDrop={handleDrop} />
        <ImageList images={images} onDragEnd={handleDragEnd} onCropClick={setSelectedImage} />
        {selectedImage && (
          <CropModal
            image={selectedImage}
            crop={crop}
            setCrop={setCrop}
            cropShape={cropShape}
            setCropShape={setCropShape}
            setImages={setImages}
            onClose={() => setSelectedImage(null)}
          />
        )}
        {images.length > 0 && (
          <div className="mt-6 text-center">
            <button className="btn btn-primary btn-wide" onClick={generatePDF}>
              Generate PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;