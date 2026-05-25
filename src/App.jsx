import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Blog from "./pages/Blog.jsx";
import About from "./pages/About.jsx";
import Service from "./pages/Service.jsx";
import Contact from "./pages/Contact.jsx";
import BlogSingle from "./pages/BlogSingle.jsx";
import Footer from "./components/footer.jsx";

const queryClient = new QueryClient();

function Layout({ children }) {
  const navLinkClassName = ({ isActive }) =>
    `inline-flex no-underline items-center justify-center rounded-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] px-[1.1rem] py-[0.72rem] font-[700] text-[#fff] shadow-[0_10px_22px_rgba(102,126,234,0.26)] transition-all duration-200 hover:-translate-y-[2px] ${isActive ? "-translate-y-[1px] shadow-[0_14px_26px_rgba(102,126,234,0.38)]" : ""}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcfdff_0%,#f4f7fb_100%)] p-[24px] text-[#111827]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col">
        <header className="sticky top-[16px] z-10 mb-[24px] flex items-center justify-between gap-[24px] rounded-[24px] border border-slate-900/[0.08] bg-white/80 px-[20px] py-[16px] shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-[16px] max-lg:static max-lg:w-full max-lg:flex-col max-lg:items-start">
          <div className="flex items-center gap-[14px]">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-[16px] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-[1.2rem] font-[800] text-[#fff] shadow-[0_12px_28px_rgba(102,126,234,0.35)]">
              B
            </span>
            <div>
              <p className="m-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#6b7280]">
                My Blog
              </p>
              <h1 className="m-[2px_0_0] text-[1.2rem] text-[#111827]">
                News blog
              </h1>
            </div>
          </div>

          <nav className="z-50 flex flex-wrap items-center gap-[12px] max-lg:w-full">
            <NavLink to="/" end className={navLinkClassName}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClassName}>
              About
            </NavLink>
            <NavLink to="/services" className={navLinkClassName}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkClassName}>
              Contact
            </NavLink>
          </nav>
        </header>

        <main className="w-full pb-[40px] pt-[64px]">{children}</main>
        <Footer />
      </div>
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
