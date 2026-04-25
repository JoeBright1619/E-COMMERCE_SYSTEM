import { Link } from 'react-router-dom';
import './CollectionSection.css';

interface CollectionSectionProps {
  title: string;
  description: string;
  category: string;
}

const COLLECTION_ITEMS = [
  { id: 1, image: '/assets/product_watch_1776467103171.png',      name: 'Smartwatch',  link: '/product/1', bg: '#e8e0d5' },
  { id: 2, image: '/assets/product_headphones_1776467120598.png', name: 'Headphones',  link: '/product/2', bg: '#dce4ed' },
  { id: 3, image: '/assets/product_sneakers_1776467199864.png',   name: 'Sneakers',    link: '/product/3', bg: '#e5ede0' },
  { id: 4, image: '/assets/wireless_charger.png',                 name: 'Charger',     link: '/product/8', bg: '#ede8e0' },
];

const CollectionSection = ({ title, description, category }: CollectionSectionProps) => {
  return (
    <section className="collection-section">
      <div className="collection-header">
        <div>
          <h2 className="collection-title">{title}</h2>
          <p className="collection-description">{description}</p>
        </div>
        <Link to={`/shop?category=${category}`} className="collection-link">
          View All →
        </Link>
      </div>

      <div className="collection-grid">
        {COLLECTION_ITEMS.map((item) => (
          <Link key={item.id} to={item.link} className="collection-item">
            <div className="collection-image" style={{ background: item.bg }}>
              <img src={item.image} alt={item.name} className="collection-img" />
            </div>
            <p className="collection-item-name">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionSection;
