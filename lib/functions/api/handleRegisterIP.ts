// Your component or event handler
export async function handleRegisterIP(castName: string, prompt: string, imagePath: string, castId: number, walletAddress: string) {
    const data = {
        castName,
        prompt,
        castId,
        walletAddress,
        imagePath
    };

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/register-ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error('Failed to register ip:', response.statusText);
        }
    } catch (error) {
        console.error('Error during API call:', error);
    }
};
