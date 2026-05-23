import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Blog from "./pages/Blog.jsx";
import About from "./pages/About.jsx";
import Service from "./pages/Service.jsx";
import Contact from "./pages/Contact.jsx";
import BlogSingle from "./pages/BlogSingle.jsx";
import "./App.css";

const queryClient = new QueryClient();

function Layout({ children }) {
  
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

        <nav className="nav-bar z-50">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item${isActive ? " is-active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-item${isActive ? " is-active" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `nav-item${isActive ? " is-active" : ""}`
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-item${isActive ? " is-active" : ""}`
            }
          >
            Contact
          </NavLink>
        </nav>
       
      </header>

      <main className="content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
