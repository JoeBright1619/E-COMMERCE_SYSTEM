import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero glass-panel">
        <h1>About <span className="text-gradient">CAGURA</span></h1>
        <p className="lead">Redefining the digital lifestyle through premium electronics and unparalleled design.</p>
      </div>

      <div className="about-content">
        <div className="about-section glass-panel">
          <h2>Our Mission</h2>
          <p>
            At CAGURA, we believe that technology should be an elegant extension of yourself.
            Founded in 2026, our mission is to curate and create the finest electronic devices and accessories
            that don't just perform flawlessly, but look stunning while doing it.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card glass-panel">
            <h3>Premium Quality</h3>
            <p>Every product in our catalog undergoes rigorous testing to ensure it meets our exacting standards for durability, performance, and aesthetics.</p>
          </div>
          <div className="about-card glass-panel">
            <h3>Sustainable Tech</h3>
            <p>We are committed to reducing our carbon footprint by partnering with brands that prioritize recycled materials and sustainable manufacturing.</p>
          </div>
          <div className="about-card glass-panel">
            <h3>24/7 Support</h3>
            <p>Our dedicated team of tech experts is always available to help you troubleshoot, setup, or simply choose the perfect device for your needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
