"use server";

export async function uploadFileToIpfs(imageBlob: Blob) {
  // First pin the image
  const data = new FormData();
  data.append("file", imageBlob);
  const pinFileRes = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    }
  );
  const { IpfsHash: ImageIpfsHash } = await pinFileRes.json();
  return ImageIpfsHash;
}
