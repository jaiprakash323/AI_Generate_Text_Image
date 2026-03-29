import axios from "axios";

const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;
const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

/**
 * Enhance a prompt using GPT-4o-mini
 * @param {string} userPrompt
 * @returns {string} enhanced prompt
 */
export const enhancePrompt = async (userPrompt) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert prompt engineer. Transform the following simple request into a 50-word descriptive masterpiece including lighting, camera angle, and artistic style. Return only the enhanced prompt.",
          },
          { role: "user", content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("Enhancement failed:", err.response?.data || err.message);
    throw new Error("Failed to enhance prompt");
  }
};

/**
 * Generate image using DALL·E 3
 * @param {string} prompt
 * @returns {string} image URL
 */
export const generateImage = async (prompt) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.data[0].url;
  } catch (err) {
    console.error("Image generation failed:", err.response?.data || err.message);
    throw new Error("Failed to generate image");
  }
};

/**
 * Analyze image using Gemini Vision
 * @param {string} base64Image
 * @returns {object} analysis { mainSubject, lighting, style, colorPalette }
 */
export const analyzeImage = async (base64Image) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const payload = {
      contents: [
        {
          parts: [
            {
              text:
                "Analyze this image. Return a JSON object with keys: mainSubject (string), lighting (string), style (string), colorPalette (array of strings).",
            },
            { inline_data: { mime_type: "image/jpeg", data: base64Image } },
          ],
        },
      ],
    };

    const res = await axios.post(url, payload);
    const text = res.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Could not parse analysis");
  } catch (err) {
    console.error("Analysis failed:", err.response?.data || err.message);
    throw new Error("Failed to analyze image");
  }
};