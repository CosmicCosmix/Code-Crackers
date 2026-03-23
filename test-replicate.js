const replicateKey = "rr8_WDu5Tfr25xfjyxrGBMS8JC0ckSV4vr02qkicf";

async function run() {
  const modelName = "stability-ai/stable-diffusion";
  console.log("Testing POST to", `https://api.replicate.com/v1/models/${modelName}/predictions`);
  const response = await fetch(`https://api.replicate.com/v1/models/${modelName}/predictions`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${replicateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt: "a cat",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        mask: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      }
    })
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Body:", text);
}

run();
