"use server";
import axios from "axios";
import { uploadFileToIpfs } from "../pinata/uploadFileToIPFS";
import { updateImagePathOnCast } from "../supabase/updateImagePathOnCast";
import { blobToBuffer } from "@/lib/utils/blobToBuffer";
import { base64ToBlob } from "@/lib/utils/base64ToBlob";

export async function handleModifyImage(
  cid: string,
  prompt: string,
  createdArtcastId: number,
  strength: number
) {
  const imageResponse = await fetch(`https://ipfs.io/ipfs/${cid}`);
  const buffer = await blobToBuffer(imageResponse);

  const payload = {
    image: buffer,
    prompt,
    strength,
    output_format: "png",
    mode: "image-to-image",
    model: "sd3-medium",
  };

  const response = await axios.postForm(
    `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
    axios.toFormData(payload, new FormData()),
    {
      headers: {
        // "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      method: "POST",
    }
  );

  if (response.status !== 200) {
    throw new Error(`${response.status}: ${await response.data.toString()}`);
  }

  const result = await response.data;
  let imageBlob = base64ToBlob(result.image, "image/jpeg");
  // const imageBuffer = await blobToBuffer(imageBlob);
  // const consenscedImageBuffer = await sharp(imageBuffer)
  //   .jpeg({ quality: 10 }) // Adjust the quality value as needed (between 0 and 100)
  //   .toBuffer();
  // imageBlob = new Blob([consenscedImageBuffer], { type: "image/jpeg" });
  const imageIPFSHash = await uploadFileToIpfs(imageBlob);
  await updateImagePathOnCast(imageIPFSHash, createdArtcastId);
  return imageIPFSHash;
}
