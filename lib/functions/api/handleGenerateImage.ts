// Your component or event handler
export async function handleGenerateImage(
  prompts: string[],
  createdArtcastId: number
) {
  const data = {
    prompts,
    createdArtcastId,
  };

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      return result.imageIpfsHash;
    } else {
      console.error("Failed to generate image:", response.statusText);
    }
  } catch (error) {
    console.error("Error during API call:", error);
  }
}
