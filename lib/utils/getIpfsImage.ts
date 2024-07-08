export function getIpfsImage(ipfsUri: string) {
  return "https://ipfs.io/ipfs/" + ipfsUri.replace("ipfs://", "");
}
