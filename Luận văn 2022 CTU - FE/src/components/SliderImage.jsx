import React from 'react';
import ImageGallery from 'react-image-gallery';

function SliderImage({image}) {
    // image.map(item => {
    //     const container = {
    //         original: item,
    //         thumbnail: item,
    //     };
    //     return container;
    // })


    const images = [
      // {
      //   original: 'https://picsum.photos/id/1018/1000/600/',
      //   thumbnail: 'https://picsum.photos/id/1018/250/150/',
      // },
      // {
      //   original: 'https://www.teahub.io/photos/full/146-1460437_franky-one-piece.jpg',
      //   thumbnail: 'https://www.teahub.io/photos/full/146-1460437_franky-one-piece.jpg',
      // },
      // {
      //   original: 'https://picsum.photos/id/1015/1000/600/',
      //   thumbnail: 'https://picsum.photos/id/1015/250/150/',
      // },
      // {
      //   original: 'https://picsum.photos/id/1019/1000/600/',
      //   thumbnail: 'https://picsum.photos/id/1019/250/150/',
      // },
    ];
    image.map(item => {
        const container = {
            original: item,
            thumbnail: item,
            originalAlt: "cccc",
            originalWidth: "100%",
            originalHeight: "450px",
            thumbnailWidth: "100px",
            thumbnailHeight: "70px",
        }
        images.push(container);
    })
  return (
    <div>
        <ImageGallery items={images}/>
    </div>
  )
}

export default SliderImage