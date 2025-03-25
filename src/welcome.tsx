import React from "react";

const WebPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white py-4 text-center text-xl font-semibold">
        My Basic Web Page
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to My Website</h1>
        <p className="mt-4 text-lg">This is a simple web page using React and TailwindCSS.</p>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Click Me
        </button>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-3 text-center">
        &copy; 2025 My Website. All rights reserved.
      </footer>
    </div>
  );
};

export default WebPage;