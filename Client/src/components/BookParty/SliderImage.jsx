import React from 'react';
import ImageGallery from 'react-image-gallery';

function SliderImage({ image }) {
  const images = [];

  image.map(item => {
    const container = {
      original: item.party_hall_image_content,
      thumbnail: item.party_hall_image_content,
      originalAlt: "cccc",
      originalWidth: "100%",
      originalHeight: "450px",
      thumbnailWidth: "100px",
      thumbnailHeight: "70px",
    }
    images.push(container);
  });

  return (
    <div>
      <ImageGallery items={images} />
    </div>
  )
}

export default SliderImage