
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-burgundy-700">Sri Adhavan Silks</h3>
            <p className="text-gray-600">
              Offering the finest silk sarees with exceptional quality and craftsmanship.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-burgundy-700">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gold-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-600 hover:text-gold-600 transition-colors">
                  Catalog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-burgundy-700">Contact Us</h4>
            <p className="text-gray-600">
              8/177-A, Mettur Main Road,<br />
              Panjukalipatty, Panankattur, Tk, P.O,<br />
              Omalur, Salem, Tamil Nadu 636455
            </p>
            <div className="mt-4">
              <a href="https://wa.me/919688484344" className="text-gold-600 hover:text-gold-800 transition-colors">
                +91 9688 484344
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Sri Adhvan Silks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
