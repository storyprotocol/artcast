//@ts-nocheck
'use server';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { supabaseClient } from '../supabase/supabaseClient';
import pngToJpeg from 'png-to-jpeg';
import { getSupabaseImagePath } from '../utils';

async function blobToBuffer(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

function base64ToBlob(base64, mimeType) {
    // Decode Base64 string
    const byteCharacters = atob(base64);

    // Create an array of byte values
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Convert to a binary representation
    const byteArray = new Uint8Array(byteNumbers);

    // Create and return a Blob with the binary data and MIME type
    return new Blob([byteArray], { type: mimeType });
}

async function modifyImage(downloadedImageBuffer, prompt) {
    // NOTE: This example is using a NodeJS FormData library.
    // Browsers should use their native FormData class.
    // React Native apps should also use their native FormData class.
    const formData = new FormData();
    formData.append('init_image', downloadedImageBuffer);
    formData.append('init_image_mode', "IMAGE_STRENGTH");
    formData.append('image_strength', 0.40);
    formData.append('steps', 30);
    formData.append('seed', 0);
    formData.append('cfg_scale', 30);
    formData.append('samples', 1);
    formData.append('text_prompts[0][text]', prompt)
    formData.append('text_prompts[0][weight]', 1);
    formData.append('text_prompts[1][text]', 'blurry, bad')
    formData.append('text_prompts[1][weight]', -1);

    const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
        {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            },
            body: formData,
        }
    );

    const result = await response.json();
    return result;
}

async function maskImage(downloadedImageBuffer, prompt) {
    // NOTE: This example is using a NodeJS FormData library.
    // Browsers should use their native FormData class.
    // React Native apps should also use their native FormData class.
    const formData = new FormData();
    formData.append('init_image', downloadedImageBuffer);
    formData.append('mask_source', 'MASK_IMAGE_BLACK')
    formData.append('mask_image', downloadedImageBuffer)
    formData.append('steps', 40);
    formData.append('seed', 0);
    formData.append('cfg_scale', 30);
    formData.append('samples', 1);
    formData.append('text_prompts[0][text]', prompt)
    formData.append('text_prompts[0][weight]', 1);
    formData.append('text_prompts[1][text]', 'blurry, bad')
    formData.append('text_prompts[1][weight]', -1);

    const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/image-to-image/masking",
        {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`)
    }

    const result = await response.json();
    return result;
}

export async function generateImage(castName: string, castImagePath: string, prompt: string, createdArtcastId: number) {
    const { data, error } = await supabaseClient
        .storage
        .from('artcast_images')
        .download(castImagePath)
    console.log('downloaded image file', data, error)
    const downloadedImageBuffer = await blobToBuffer(data);

    const result = await modifyImage(downloadedImageBuffer, prompt);
    console.log(result);
    let image_path = getSupabaseImagePath(castName, createdArtcastId);
    let imageBlob = base64ToBlob(result.artifacts[0].base64, 'image/png');
    const imageBuffer = await blobToBuffer(imageBlob);
    const imageJpeg = await pngToJpeg({ quality: 90 })(imageBuffer);
    const finalBlob = new Blob([imageJpeg], { type: 'image/jpeg' });
    // upload the image to storage
    await supabaseClient
        .storage
        .from('artcast_images')
        .upload(image_path, finalBlob);
    console.log('saving generated image to supabase')
    await supabaseClient.from('cast_datas').update({
        image_path
    }).eq('id', createdArtcastId)
}