import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Blog from './pages/Blog.jsx';
import About from './pages/About.jsx';
import Service from './pages/Service.jsx';
import Contact from './pages/Contact.jsx';
import BlogSingle from './pages/BlogSingle.jsx';
import SearchModal from './components/SearchModal.jsx';
import './App.css';


function Layout({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/posts?limit=0')
      .then((response) => response.json())
      .then((data) => setBlogs(data.posts))
      .catch((err) => console.error('Failed to fetch blogs:', err));
  }, []);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">B</span>
          <div>
            <p className="brand-kicker">My Blog</p>
            <h1 className="brand-title">News blog</h1>
          </div>
        </div>

        <nav className="nav-bar">
          <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
            Services
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
            Contact
          </NavLink>
        </nav>
        <button 
          type="button" 
          className="nav-item"
          onClick={handleSearchOpen}
        >
          Search
        </button>
      </header>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={handleSearchClose}
        blogs={blogs}
      />

      <main className="content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Blog />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/services"
        element={
          <Layout>
            <Service />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/blogs/:id/:searchTerm?"
        element={
          <Layout>
            <BlogSingle />
          </Layout>
        }
      />
       <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}

export default App;