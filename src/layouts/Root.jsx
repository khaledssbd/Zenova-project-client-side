import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';

const Root = () => {
  
  useEffect(() => {
    AOS.init({ duration: '1000' });
  }, []);

  return (
    <div>
      <ScrollRestoration />
      <div className="mx-3 sm:mx-5 lg:mx-28 md:20 md:mt-8 mt-4">
        <div>
          <Navbar />
        </div>
        <div className="min-h-[calc(100vh-458px)]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Root;
