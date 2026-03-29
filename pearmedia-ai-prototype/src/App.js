import React, { useState } from 'react';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';
import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('text');
  const { isLoading } = useLoading();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pear Media AI Lab</h1>
        <p className="text-gray-600 mb-6">Bridge user inputs to AI outputs</p>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-8">
          {activeTab === 'text' ? <WorkflowText /> : <WorkflowImage />}
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;