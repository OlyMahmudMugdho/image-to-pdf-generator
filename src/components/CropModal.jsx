import React, { useState, useRef } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import Button from './Button.jsx';

function CropModal({ image, setImages, onClose }) {
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const cropperRef = useRef(null);

  // Handle cropping
  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas(); // Get the cropped image as a canvas
      if (canvas) {
        const croppedImageURL = canvas.toDataURL('image/jpeg'); // Convert canvas to data URL
        setCroppedImageUrl(croppedImageURL);
        setError(null);
      } else {
        setError('Failed to crop image');
      }
    }
  };

  // Save the cropped image
  const handleSave = () => {
    if (croppedImageUrl && !error) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, cropped: croppedImageUrl } : img
        )
      );
      onClose();
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 shadow-xl max-w-2xl">
        <h3 className="text-lg font-bold mb-4">Crop Image</h3>

        {/* Cropper */}
        <div className="max-w-full overflow-hidden rounded-lg">
          <Cropper
            ref={cropperRef}
            src={image.url} // Source image URL
            className="w-full h-[400px]" // Fixed height for the cropper
            stencilProps={{
              aspectRatio: undefined, // Allow free cropping
            }}
          />
        </div>

        {/* Preview */}
        {croppedImageUrl && (
          <div className="mt-4">
            <h4 className="text-md font-semibold">Preview:</h4>
            <img
              src={croppedImageUrl}
              alt="cropped preview"
              className="max-h-32 w-auto mt-2 rounded-md border border-base-300"
              onError={() => setError('Preview failed to load')}
            />
          </div>
        )}

        {/* Error Message */}
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

        {/* Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          <Button onClick={handleCrop} className="btn btn-success btn-sm">
            Crop Image
          </Button>
          <Button onClick={handleSave} className="btn btn-primary btn-sm" disabled={!croppedImageUrl || error}>
            Save
          </Button>
          <Button onClick={onClose} className="btn btn-error btn-sm">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CropModal;