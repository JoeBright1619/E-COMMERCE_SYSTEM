import { Link } from 'react-router-dom';
import { Watch, Headphones, Monitor, MousePointer2, Shirt, ShoppingBag, Footprints } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const categories = [
    { name: 'Men\'s Clothing', icon: Shirt, count: 6, description: 'Premium menswear essentials.', color: 'rgba(59, 130, 246, 0.2)' },
    { name: 'Women\'s Clothing', icon: ShoppingBag, count: 6, description: 'Elegant womenswear pieces.', color: 'rgba(236, 72, 153, 0.2)' },
    { name: 'Footwear', icon: Footprints, count: 5, description: 'Classic and modern shoes.', color: 'rgba(245, 158, 11, 0.2)' },
    { name: 'Wearables', icon: Watch, count: 3, description: 'Smartwatches and fitness trackers.', color: 'rgba(225, 29, 72, 0.2)' },
    { name: 'Audio', icon: Headphones, count: 6, description: 'High-fidelity headphones and speakers.', color: 'rgba(245, 158, 11, 0.2)' },
    { name: 'Displays', icon: Monitor, count: 3, description: '4K monitors and curved displays.', color: 'rgba(168, 85, 247, 0.2)' },
    { name: 'Accessories', icon: MousePointer2, count: 18, description: 'Keyboards, mice, bags, and luxury items.', color: 'rgba(16, 185, 129, 0.2)' }
  ];

  return (
    <div className="page-background categories-bg">
      <div className="categories-page">
      <div className="page-header text-center mb-5">
        <h1>Shop by <span className="text-gradient">Category</span></h1>
        <p className="text-secondary">Explore our curated collections of premium tech.</p>
      </div>

      <div className="category-grid">
        {categories.map(cat => (
          <Link 
            to={`/shop?category=${encodeURIComponent(cat.name)}`} 
            key={cat.name} 
            className="category-card glass-panel"
            style={{ background: `linear-gradient(135deg, ${cat.color} 0%, var(--bg-glass) 100%)` }}
          >
            <div className="category-icon-wrapper">
              <cat.icon size={32} className="category-icon" />
            </div>
            <h2>{cat.name}</h2>
            <p className="text-secondary">{cat.description}</p>
            <span className="item-count">{cat.count} items</span>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Categories;
