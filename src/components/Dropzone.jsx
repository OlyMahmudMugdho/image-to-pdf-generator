import React from 'react';
import { useDropzone } from 'react-dropzone';

function Dropzone({ onDrop }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-base-300 p-6 rounded-box text-center cursor-pointer hover:bg-base-200 transition mb-6"
    >
      <input {...getInputProps()} />
      <p className="text-base-content">Drag & drop images here, or click to select</p>
    </div>
  );
}

export default Dropzone;