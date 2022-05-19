let provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

const contractAddress = "0x9D33CC570648eB3B1440ABF02E1D48903194C189"; //address of deployed contract

const contractFunctions = [
  ` function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256)`,
];
//functions signature of a the given contract address

const mintContract = new ethers.Contract(
  contractAddress,
  contractFunctions,
  provider,
  signer
);

async function connectMetamask() {
  console.log(await provider.send("eth_requestAccounts", []));
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  console.log(signer);
  console.log("Account Address:", await signer.getAddress());
  return signer;
}

async function mint() {
  signer = connectMetamask();
  mintContract.signer = signer;
  var x = document.getElementById("frm1");
  const recipientAddress = x.elements[0].value;
  const tokenURI = x.elements[1].value;
  console.log(signer);
  //console.log(recipientAddress, tokenURI);
  await mintContract.mintNFT(recipientAddress, tokenURI);
}
