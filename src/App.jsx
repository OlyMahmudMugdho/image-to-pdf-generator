import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 / 1 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropShape, setCropShape] = useState('rect'); // 'rect', 'circle', or 'free'

  // Handle image upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        cropped: null,
      }));
      setImages((prev) => [...prev, ...newImages]);
    },
  });

  // Handle drag-and-drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImages(reorderedImages);
  };

  // Handle cropping
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    if (!selectedImage) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = selectedImage.url;
    img.onload = () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      const croppedUrl = canvas.toDataURL('image/jpeg');
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedImage.id ? { ...img, cropped: croppedUrl } : img
        )
      );
      setSelectedImage(null);
    };
  };

  // Generate PDF
  const generatePDF = () => {
    const pdf = new jsPDF();
    images.forEach((image, index) => {
      if (index > 0) pdf.addPage();
      const imgData = image.cropped || image.url;
      pdf.addImage(imgData, 'JPEG', 10, 10, 190, 0); // Auto height
    });
    const pdfBlob = pdf.output('blob');
    saveAs(pdfBlob, 'images.pdf');
  };

  return (
    <div className="App">
      <h1>Image to PDF Generator</h1>

      {/* Image Upload */}
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select</p>
      </div>

      {/* Image List with Drag-and-Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="image-item"
                    >
                      <img
                        src={image.cropped || image.url}
                        alt="preview"
                        width="100"
                      />
                      <button onClick={() => setSelectedImage(image)}>
                        Crop
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Crop Modal */}
      {selectedImage && (
        <div className="crop-modal">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={onCropComplete}
            circularCrop={cropShape === 'circle'}
            aspect={cropShape === 'free' ? undefined : crop.aspect}
          >
            <img src={selectedImage.url} alt="crop" />
          </ReactCrop>
          <div>
            <button onClick={() => setCropShape('rect')}>Rectangle</button>
            <button onClick={() => setCropShape('circle')}>Circle</button>
            <button onClick={() => setCropShape('free')}>Freeform</button>
            <button onClick={() => setSelectedImage(null)}>Done</button>
          </div>
        </div>
      )}

      {/* Generate PDF Button */}
      {images.length > 0 && (
        <button onClick={generatePDF}>Generate PDF</button>
      )}
    </div>
  );
}

export default App;
