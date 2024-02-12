//@ts-nocheck
'use server';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { supabaseClient } from '../supabase/supabaseClient';
import pngToJpeg from 'png-to-jpeg';

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

export async function generateImage(imageName: string, castImagePath: string, prompt: string, createdArtcastId: number) {
    const { data, error } = await supabaseClient
        .storage
        .from('artcast_images')
        .download(castImagePath)
    console.log('downloaded image file', data, error)
    const downloadedImageBuffer = await blobToBuffer(data);

    // NOTE: This example is using a NodeJS FormData library.
    // Browsers should use their native FormData class.
    // React Native apps should also use their native FormData class.
    const formData = new FormData();
    formData.append('init_image', downloadedImageBuffer);
    formData.append('init_image_mode', "IMAGE_STRENGTH");
    formData.append('image_strength', 0.35);
    formData.append('steps', 40);
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

    const thing2 = await response.json()
    let image_path = "id" + Math.random().toString(16).slice(2) + '/' + imageName;
    let imageBlob = base64ToBlob(thing2.artifacts[0].base64, 'image/png');
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

    // if (!response.ok) {
    //     throw new Error(`Non-200 response: ${await response.text()}`)
    // }

    // const responseJSON = await response.json();

    // console.log({ responseJSON })

    // responseJSON.artifacts.forEach(async (image: any, index: any) => {
    //     console.log({ image })
    //     let image_path = "id" + Math.random().toString(16).slice(2) + '/' + imageName;
    //     // upload the image to storage
    //     const { data, error } = await supabaseClient
    //         .storage
    //         .from('artcast_images')
    //         .upload(image_path, image);
    //     console.log('saving generated image to supabase', data, error)
    //     await supabaseClient.from('cast_datas').update({
    //         image_path
    //     }).eq('id', createdArtcastId)
    // });
}