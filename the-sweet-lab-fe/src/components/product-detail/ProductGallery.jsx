import { useEffect, useState } from 'react';
import { getCategoryImage } from '../../utils/format';

function ProductGallery({ images = [], productName, categoryName }) {
  const fallbackImg = getCategoryImage(categoryName);
  const displayImages =
    images.length > 0
      ? images
      : [{ id: 'fallback-0', imageUrl: fallbackImg, isThumbnail: true }];

  const [activeUrl, setActiveUrl] = useState(displayImages[0].imageUrl);

  useEffect(() => {
    setActiveUrl(displayImages[0].imageUrl);
  }, [images, categoryName]);

  return (
    <div>
      <div className="gallery-main-box">
        <img
          src={activeUrl}
          alt={productName}
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + fallbackImg) {
              e.currentTarget.src = fallbackImg;
            }
          }}
        />
      </div>

      <div className="gallery-thumbs">
        {displayImages.map((img, idx) => (
          <button
            key={img.id ?? idx}
            type="button"
            className={`gallery-thumb-btn ${activeUrl === img.imageUrl ? 'active' : ''}`}
            onClick={() => setActiveUrl(img.imageUrl)}
          >
            <img
              src={img.imageUrl}
              alt={`${productName} ${idx + 1}`}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + fallbackImg) {
                  e.currentTarget.src = fallbackImg;
                }
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
