import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Browse from './components/Browse';
import Post from './components/Post';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';

export default function App() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/">🎓 IIITA<span style={{ color: 'red' }}>B</span>azaar</NavLink>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/browse">Browse Listings</NavLink></li>
          <li><NavLink to="/post">Post an Item</NavLink></li>
          <li><NavLink to="/login">Login / Signup</NavLink></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<AuthPage defaultTab="login" />} />
        <Route path="/signup" element={<AuthPage defaultTab="signup" />} />
        <Route path="/product" element={<ProductPage />} />
      </Routes>
    </>
  );
}
