const validator = require("./../middleware/validator");
const { ethers } = require("ethers");
const HttpError = require("./../util/http-error");

const INFURA_ID = "7e5ac588b550481e8df3f4b6d8f4da6d";
const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${INFURA_ID}`
);

const Jackpot_ABI = [
  "function enter(address token, uint amountToPay) public payable",
  "function transferERC20(address token) public",
];

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) public virtual override returns (bool)",
  "function balanceOf(address account) public view virtual override returns (uint256)",
  "function mint(address to, uint256 amount) public",
  "function approve(address spender, uint256 amount) public virtual override returns (bool)",
];

const jackpotAddress = "0x0A12d978d14f146feACdCF7738EF19A4E36bC32f";
const tokenAddress = "0x8665Fe36ddEdB37EBe606ef74caA9EB9a0453d11";

const enterUser = async (req, res, next) => {
  if (validator.validateCheck(req, res)) {
    return;
  }

  let { privateKey, entryfee } = req.body;

  let contract;
  let wallet;
  let tokenContract;

  try {
    contract = new ethers.Contract(jackpotAddress, Jackpot_ABI, provider);
    // tokenContract = new ethers.Contract(tokenAddress, ERC_ABI, provider);
    wallet = new ethers.Wallet(privateKey, provider);
  } catch (err) {
    const error = new HttpError(
      "Failed to connect to wallet, please try again later." + err,
      500
    );
    return next(error);
  }
  let tx;
  try {
    const contractWithWallet = contract.connect(wallet);
    // const contractTokenWithWallet = tokenContract.connect(wallet);
    // tx = await contractTokenWithWallet.approve(jackpotAddress, entryfee);
    tx = await contractWithWallet.enter(tokenAddress, entryfee);
    await tx.wait();
  } catch (err) {
    const error = new HttpError(
      "Failed to enter jackpot, please try again later." + err,
      500
    );
    return next(error);
  }

  res.status(200).send(tx);
};

const awardWinner = async (req, res, next) => {
  if (validator.validateCheck(req, res)) {
    return;
  }

  const { privateKey } = req.body;
  let contract;
  let wallet;

  try {
    contract = new ethers.Contract(jackpotAddress, Jackpot_ABI, provider);
    wallet = new ethers.Wallet(privateKey, provider);
  } catch (err) {
    const error = new HttpError(
      "Failed to connect to wallet, please try again later." + err,
      500
    );
    return next(error);
  }

  let tx;

  try {
    const contractWithWallet = contract.connect(wallet);

    tx = await contractWithWallet.transferERC20(tokenAddress);

    await tx.wait();
  } catch (err) {
    const error = new HttpError(
      "Failed to get winner, please try again later." + err,
      500
    );
    return next(error);
  }

  res.status(200).send(tx);
};

module.exports = { awardWinner, enterUser };
