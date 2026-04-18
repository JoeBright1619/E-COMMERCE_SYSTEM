import { Link } from 'react-router-dom';
import { Watch, Headphones, Laptop, Monitor, MousePointer2 } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const categories = [
    { name: 'Wearables', icon: Watch, count: 12, description: 'Smartwatches and fitness trackers.', color: 'rgba(225, 29, 72, 0.2)' },
    { name: 'Audio', icon: Headphones, count: 24, description: 'High-fidelity headphones and speakers.', color: 'rgba(245, 158, 11, 0.2)' },
    { name: 'Computers', icon: Laptop, count: 8, description: 'Laptops, desktops, and accessories.', color: 'rgba(14, 165, 233, 0.2)' },
    { name: 'Displays', icon: Monitor, count: 15, description: '4K monitors and curved displays.', color: 'rgba(168, 85, 247, 0.2)' },
    { name: 'Accessories', icon: MousePointer2, count: 32, description: 'Keyboards, mice, and cables.', color: 'rgba(16, 185, 129, 0.2)' }
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
            to={`/shop?category=${cat.name}`} 
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
