import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes here as we build pages */}
            <Route path="/products" element={<div className="page-placeholder">Products Page - Coming Soon</div>} />
            <Route path="/cart" element={<div className="page-placeholder">Cart Page - Coming Soon</div>} />
            <Route path="/login" element={<div className="page-placeholder">Login Page - Coming Soon</div>} />
            <Route path="/register" element={<div className="page-placeholder">Register Page - Coming Soon</div>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
