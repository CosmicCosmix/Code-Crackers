export async function runInpaintingTask(replicateKey, currentImage, maskImage, prompt) {
  const model = "stability-ai/stable-diffusion-inpainting";
  // The Replicate API might have specific endpoint URL, we'll try standard predictions endpoint.
  // Note: Standard API calls to api.replicate.com directly from browsers often hit CORS issues.
  // We'll use the REST API as typical for JS applications if not using proxy.
  
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${replicateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "c28b92a2eb84-this-is-pseudo-version-id-for-inpainting", // Normally need full version string, omitting for purely illustrative prototype or using model name
      // We will use the models/predictions instead for model names directly
      // POST /v1/models/stability-ai/stable-diffusion-inpainting/predictions
    })
  });
}

// Actually, Replicate recommended REST API format for models:
export async function createPrediction(replicateKey, modelName, input) {
  // Map model name to its latest version ID since /v1/models/.../predictions can sometimes correctly return 404 for certain plans/models.
  const versions = {
    "stability-ai/stable-diffusion-inpainting": "95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3",
    "stability-ai/stable-diffusion": "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4"
  };
  const version = versions[modelName];

  // Try calling the Replicate API directly using Vite proxy
  const response = await fetch(`/api/replicate/v1/predictions`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${replicateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version, input })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || err.message || "Failed to start AI prediction");
  }

  let prediction = await response.json();

  // Poll for completion
  while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
    await new Promise((r) => setTimeout(r, 1000));
    const pollResponse = await fetch(`/api/replicate/v1/predictions/${prediction.id}`, {
      headers: {
        "Authorization": `Token ${replicateKey}`,
      }
    });
    if (!pollResponse.ok) {
      throw new Error("Failed to poll prediction status");
    }
    prediction = await pollResponse.json();
  }

  if (prediction.status === "failed") {
    throw new Error(prediction.error || "AI generation failed");
  }

  // usually prediction.output is an array of image URLs
  return prediction.output[0];
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
