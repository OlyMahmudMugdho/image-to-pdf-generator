import React from 'react';

const PreviewImage = ({ src, alt, className, onError }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
    />
  );
};

export default PreviewImage;