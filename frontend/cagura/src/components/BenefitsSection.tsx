import { Heart, Leaf, Zap } from 'lucide-react';
import './BenefitsSection.css';

const BenefitsSection = () => {
  const benefits = [
    {
      id: 1,
      icon: Zap,
      title: 'Wear All Day Comfort',
      description: 'Lightweight, bouncy, and wildly comfortable. Slip in, lace up, or slide them on and enjoy the comfy support for every occasion.'
    },
    {
      id: 2,
      icon: Leaf,
      title: 'Sustainability in Every Step',
      description: 'From materials to transport, we\'re working to reduce our carbon footprint to near zero. Striving for climate goals is now, not later.'
    },
    {
      id: 3,
      icon: Heart,
      title: 'Materials from the Earth',
      description: 'We replace petroleum-based synthetics with natural alternatives. Wool, tree fiber, and sugarcane are soft, breathable, and better for the planet.'
    }
  ];

  return (
    <section className="benefits-section">
      <div className="benefits-container">
        {benefits.map((benefit) => {
          const IconComponent = benefit.icon;
          return (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon">
                <IconComponent size={32} />
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BenefitsSection;
