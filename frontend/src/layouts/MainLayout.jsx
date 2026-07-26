import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import RouteScrollManager from "../components/layout/RouteScrollManager";
import BackToTop from "../components/ui/BackToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background font-body text-text transition-colors duration-300">
      <RouteScrollManager />
      <Navbar />

      <main className="min-h-screen bg-background text-text transition-colors duration-300">
        <Outlet />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
