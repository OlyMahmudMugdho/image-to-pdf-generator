import React from 'react';

function ImageList({ images, onDragEnd, onCropClick }) {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData('text/plain');
    if (sourceIndex !== null && sourceIndex !== targetIndex) {
      onDragEnd({
        source: { index: parseInt(sourceIndex, 10) },
        destination: { index: targetIndex },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
  };

  return (
    <div
      className="grid grid-cols-3 gap-4 mt-4"
      onDragOver={handleDragOver}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          className="relative group"
        >
          <img
            src={image.cropped || image.url}
            alt={`Image ${index + 1}`}
            className="w-full h-32 object-cover rounded-box cursor-pointer"
            onClick={() => onCropClick(image)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onCropClick(image)}
            >
              Crop
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ImageList;