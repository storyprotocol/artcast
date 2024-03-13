// Your component or event handler
export async function handleFetchCast(castId: number) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/casts/` + castId);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error during API call:', error);
  }
};
