export function getIpfsImage(ipfsUri: string) {
  if (ipfsUri) {
    return "https://ipfs.io/ipfs/" + ipfsUri.replace("ipfs://", "");
  }
  return "";
}
