import React from 'react';

const ImageCard = ({ imageUrl, altText }) => {
  if (!imageUrl) return null;
  return (
    <div className="mt-4 rounded-xl overflow-hidden shadow-lg">
      <img src={imageUrl} alt={altText} className="w-full h-auto object-cover" />
    </div>
  );
};

export default ImageCard;