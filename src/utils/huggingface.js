// Using Hugging Face Inference API for free prototyping
export async function createHfPrediction(hfToken, modelName, input) {
  // Try calling the Hugging Face API via Vite proxy
  const response = await fetch(`/api/huggingface/models/${modelName}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${hfToken}`,
      "Content-Type": "application/json",
      // Set to wait for model to load if cold
      "x-use-cache": "false",
      "x-wait-for-model": "true"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = errText;
    try {
      const errJson = JSON.parse(errText);
      errMsg = errJson.error || errJson.detail || errText;
    } catch(e) {}
    throw new Error(errMsg || "Failed to start AI prediction");
  }

  // HF Inference API usually returns the image directly as a blob for vision models!
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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
