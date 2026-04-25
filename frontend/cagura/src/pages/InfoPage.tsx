import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './InfoPage.css';

const InfoPage = () => {
  const { pageId } = useParams();

  const getPageContent = () => {
    switch (pageId) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <>
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.</p>

              <h2>2. How We Use Your Information</h2>
              <p>We may use the information we collect about you to provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.</p>

              <h2>3. Data Security</h2>
              <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
            </>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using the CAGURA platform, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the service.</p>

              <h2>2. Purchases</h2>
              <p>If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.</p>

              <h2>3. Intellectual Property</h2>
              <p>The Service and its original content, features and functionality are and will remain the exclusive property of CAGURA and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
            </>
          )
        };
      case 'careers':
        return {
          title: 'Careers at CAGURA',
          content: (
            <>
              <h2>Join Our Team</h2>
              <p>At CAGURA, we are always looking for passionate, innovative individuals to join our mission of redefining the digital lifestyle. While we don't have any open positions at this exact moment, we are growing rapidly.</p>

              <h2>Why CAGURA?</h2>
              <ul>
                <li>Competitive salary and equity packages</li>
                <li>Comprehensive health, dental, and vision insurance</li>
                <li>Flexible work hours and remote options</li>
                <li>State-of-the-art equipment and workspace</li>
              </ul>

              <p className="mt-4">Please check back soon for open roles, or send your resume to careers@cagura.com.</p>
            </>
          )
        };
      case 'support':
        return {
          title: 'Help Center & Support',
          content: (
            <>
              <h2>How can we help?</h2>
              <p>Our expert support team is available 24/7 to assist you with any questions or issues regarding your CAGURA products.</p>

              <div className="support-grid mt-4">
                <div className="support-card glass-panel">
                  <h3>Order Tracking</h3>
                  <p>Check the status of your recent orders in your Profile dashboard.</p>
                </div>
                <div className="support-card glass-panel">
                  <h3>Returns</h3>
                  <p>We offer a 30-day hassle-free return policy on all unworn, undamaged items.</p>
                </div>
                <div className="support-card glass-panel">
                  <h3>Contact Us</h3>
                  <p>Email: support@cagura.com<br />Phone: 1-800-CAGURA</p>
                </div>
              </div>
            </>
          )
        };
      case 'delivery':
        return {
          title: 'Shipping & Delivery',
          content: (
            <>
              <h2>Shipping Options</h2>
              <p>We offer standard shipping on all orders, with free delivery automatically applied when your basket reaches the qualifying threshold. Expedited options can be added during checkout when available.</p>

              <h2>Processing Times</h2>
              <p>Orders are usually prepared within 1-2 business days. Once your shipment leaves our warehouse, you will receive tracking details by email so you can follow every step of the delivery.</p>

              <h2>Returns & Exchanges</h2>
              <p>If something is not quite right, you have 30 days to request a return. Items should be sent back in original condition, and our support team can help with exchanges or replacements.</p>
            </>
          )
        };
      default:
        return {
          title: 'Page Not Found',
          content: <p>The page you are looking for does not exist or has been moved.</p>
        };
    }
  };

  const { title, content } = getPageContent();

  return (
    <div className="info-page">
      <Link to="/" className="back-btn mb-4">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <div className="info-content glass-panel">
        <h1 className="info-title">{title}</h1>
        <div className="info-body">
          {content}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
