import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6 py-4">
        <button
          onClick={() => setActiveTab('text')}
          className={`text-lg font-medium ${
            activeTab === 'text'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Creative Studio
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`text-lg font-medium ${
            activeTab === 'image'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Style Lab
        </button>
      </nav>
    </div>
  );
};

export default Navbar;