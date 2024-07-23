export function getIpfsImage(ipfsUri: string) {
  return (
    "https://emerald-changing-scallop-171.mypinata.cloud/ipfs/" +
    ipfsUri.replace("ipfs://", "")
  );
}
