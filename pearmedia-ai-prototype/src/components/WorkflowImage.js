import React, { useState } from 'react';
import { analyzeImage, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';
import { useLoading } from '../context/LoadingContext';

const WorkflowImage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [variationPrompt, setVariationPrompt] = useState('');
  const [variationImage, setVariationImage] = useState('');
  const [error, setError] = useState('');
  const { isLoading, setIsLoading } = useLoading();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setBase64Image(base64);
    };
    reader.readAsDataURL(file);
    setAnalysis(null);
    setVariationPrompt('');
    setVariationImage('');
  };

  const handleAnalyze = async () => {
    if (!base64Image) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await analyzeImage(base64Image);
      setAnalysis(result);
      const prompt = `Create a variation of the image with the following attributes: main subject: ${result.mainSubject}, lighting: ${result.lighting}, style: ${result.style}, color palette: ${result.colorPalette.join(', ')}. Make it artistic and high quality.`;
      setVariationPrompt(prompt);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariation = async () => {
    if (!variationPrompt) return;
    setIsLoading(true);
    setError('');
    try {
      const imageUrl = await generateImage(variationPrompt);
      setVariationImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Style Lab</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload an Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full"
        />
        {uploadedImage && (
          <div className="mt-2">
            <img src={uploadedImage} alt="Uploaded" className="max-h-64 rounded-md" />
          </div>
        )}
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !base64Image}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          Analyze Image
        </button>
      </div>

      {analysis && (
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold">Analysis Results</h3>
          <p><strong>Main Subject:</strong> {analysis.mainSubject}</p>
          <p><strong>Lighting:</strong> {analysis.lighting}</p>
          <p><strong>Style:</strong> {analysis.style}</p>
          <p><strong>Color Palette:</strong> {analysis.colorPalette?.join(', ')}</p>
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Variation Prompt (editable)</label>
            <textarea
              value={variationPrompt}
              onChange={(e) => setVariationPrompt(e.target.value)}
              rows="3"
              className="w-full border rounded-md p-2"
            />
            <button
              onClick={handleGenerateVariation}
              disabled={isLoading}
              className="mt-2 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
            >
              Generate Variation
            </button>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ImageCard imageUrl={variationImage} altText="Style variation" />
    </div>
  );
};

export default WorkflowImage;