import './SocialMediaGallery.css';
import { Instagram } from 'lucide-react';

export default function SocialMediaGallery() {
  const galleryItems = [
    {
      id: 1,
      image: '/instagram-01.jpg',
      label: 'Fashion',
      showIcon: true
    },
    {
      id: 2,
      image: '/instagram-02.jpg',
      showIcon: true
    },
    {
      id: 3,
      image: '/instagram-03.jpg',
      showIcon: true
    },
    {
      id: 4,
      image: '/instagram-04.jpg',
      showIcon: true
    },
    {
      id: 5,
      image: '/instagram-05.jpg',
      showIcon: true
    },
    {
      id: 6,
      image: '/instagram-06.jpg',
      showIcon: true
    }
  ];

  return (
    <section className="social-media-section">
      <div className="social-media-header">
        <h2 className="social-media-title">Social Media</h2>
        <p className="social-media-subtitle">
          Details to details is what makes Hexashop different from the other themes.
        </p>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div key={item.id} className="gallery-item">
            <img src={item.image} alt={item.label || `Gallery item ${item.id}`} />
            <div className="gallery-overlay">
              {item.showIcon && (
                <>
                  <span className="gallery-label">{item.label}</span>
                  <Instagram className="instagram-icon" size={24} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}