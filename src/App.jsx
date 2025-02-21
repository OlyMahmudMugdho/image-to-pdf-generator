import React, { useState } from 'react';
import Dropzone from './components/Dropzone.jsx';
import ImageList from './components/ImageList.jsx';
import CropModal from './components/CropModal.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [theme, setTheme] = useState('light');

  // Handle image upload
  const handleDrop = async (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file), // Create a temporary URL for the uploaded file
      cropped: null, // Placeholder for the cropped image URL
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImages(reorderedImages);
  };

  // Generate PDF
  const generatePDF = () => {
    const pdf = new jsPDF();
    images.forEach((image, index) => {
      if (index > 0) pdf.addPage();
      const imgData = image.cropped || image.url; // Use cropped image if available
      pdf.addImage(imgData, 'JPEG', 10, 10, 190, 0); // Adjust dimensions as needed
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