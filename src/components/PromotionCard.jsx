// components/PromotionCard.jsx

export default function PromotionCard({ title, location, description }) {
  return (
    <div className="promotion-card">
      <div className="promotion-image">
        <div className="image-placeholder"></div>
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