import React, { useState } from 'react';
import { enhancePrompt, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';
import { useLoading } from '../context/LoadingContext';

const WorkflowText = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');
  const { isLoading, setIsLoading } = useLoading();

  const handleEnhance = async () => {
    if (!userPrompt.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const enhanced = await enhancePrompt(userPrompt);
      setEnhancedPrompt(enhanced);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const imageUrl = await generateImage(enhancedPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Creative Studio</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Your Idea</label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows="3"
          className="w-full border rounded-md p-2"
          placeholder="e.g., A futuristic city at sunset"
        />
        <button
          onClick={handleEnhance}
          disabled={isLoading || !userPrompt.trim()}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          Enhance Prompt
        </button>
      </div>

      {enhancedPrompt && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Enhanced Prompt (editable)</label>
          <textarea
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            rows="4"
            className="w-full border rounded-md p-2"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="mt-2 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
          >
            Generate Image
          </button>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ImageCard imageUrl={generatedImage} altText="Generated from enhanced prompt" />
    </div>
  );
};

export default WorkflowText;