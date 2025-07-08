
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import App from './App.tsx';
import './index.css';

// Create a simple loading component that doesn't show Contact Us
const LoadingApp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Simple navbar placeholder */}
      <div className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gold-100 rounded-full animate-pulse"></div>
            <div className="h-8 w-48 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Loading spinner for main content */}
      <div className="flex-grow flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Simple footer placeholder without contact info */}
      <div className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="h-6 w-36 bg-gray-100 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-6 w-28 bg-gray-100 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
            <div className="h-4 w-72 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LoadingApp />;
  }
  
  return <App />;
};

createRoot(document.getElementById("root")!).render(<Root />);
