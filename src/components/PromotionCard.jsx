// components/PromotionCard.jsx

export default function PromotionCard({ title, location, description, image }) {
  return (
    <div className="promotion-card">
      <div className="promotion-image">
        {image ? (
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="image-placeholder"></div>
        )}
      </div>
      <div className="promotion-content">
        <h3 className="promotion-title">{title}</h3>
        <p className="promotion-location">{location}</p>
        <p className="promotion-description">{description}</p>
        <button className="promotion-button">Learn More</button>
      </div>
    </div>
  );
}