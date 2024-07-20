import { uploadFileToIpfs } from "@/lib/functions/pinata/uploadFileToIPFS";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as Blob;

    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // compress
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const consenscedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 10 }) // Adjust the quality value as needed (between 0 and 100)
      .toBuffer();
    const finalBlob = new Blob([consenscedImageBuffer], { type: "image/jpeg" });

    const imageIPFSHash = await uploadFileToIpfs(finalBlob);

    return NextResponse.json({ ipfsHash: imageIPFSHash });
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
