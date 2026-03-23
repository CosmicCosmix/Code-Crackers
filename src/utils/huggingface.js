import { HfInference } from '@huggingface/inference';

export async function createHfPrediction(hfToken, modelName, input) {
  // 1. Strip any accidental whitespace from the pasted token
  const cleanToken = hfToken.trim();

  // 2. Initialize the official client with the clean token
  const hf = new HfInference(cleanToken);

  // Convert URL to Blob
  const imageResponse = await fetch(input.parameters.image);
  const imageBlob = await imageResponse.blob();

  try {
    // 3. We removed `:fastest` - the SDK defaults to 'auto' provider selection safely
    const resultBlob = await hf.imageToImage({
      model: modelName,
      inputs: imageBlob,
      parameters: {
        prompt: input.inputs,
        negative_prompt: input.parameters?.negative_prompt,
        ...(input.parameters?.mask_image && { mask_image: input.parameters.mask_image })
      }
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(resultBlob);
    });

  } catch (err) {
    console.error("Hugging Face API Error:", err);
    throw new Error(err.message || "Failed to start AI prediction");
  }
}

export async function fetchImageAsBase64(url) {
  const response = await fetch(url, { mode: 'cors' });
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}