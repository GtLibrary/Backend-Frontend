const myEnv = require("dotenv");
console.log(myEnv);
require("dotenv").config({
  path: "/home/john/bakerydemo/.env",
  override: true,
  debug: true,
});

const crypto = require("crypto");
const algorithm = "aes-256-ctr";

const cCAPrivateKey = process.env.cCAPrivateKey;
const cCAPrivateKeyEncrypted = process.env.cCAPrivateKeyEncrypted;
const cultureCoinAddress = process.env.cultureCoinAddress;
const unsafePassword = process.env.unsafePassword;

const testAccountAddress = process.env.testAccountAddress;
const testPrivateKey = process.env.testPrivateKey;

const printingPressAddress = process.env.printingPressAddress;
const cCA = process.env.cCA;
const marketPlaceAddress = process.env.marketPlaceAddress;
const daedalusClassBoosterAddress = process.env.daedalusClassBoosterAddress;
const theGoldenKeysAddress = process.env.theGoldenKeysAddress;
const nonceWindow = process.env.nonceWindow;

const benPettingsTable = process.env.benPettings;
const gamblersUnionAddress = process.env.gamblersUnionAddress;

const serverUrl = process.env.serverUrl;
const appId = process.env.appId;
const speedyNode = process.env.speedyNode;
const baseNetwork = process.env.baseNetwork;
const bookContracts = process.env.bookContracts;

const baseSpellsAddress = process.env.baseSpellsAddress;
const baseLootAddress = process.env.baseLootAddress;
const bookmarkAddress = process.env.bookmarkAddress;
const myItemsAddress = process.env.myItemsAddress;
const heroAddress = process.env.heroAddress;
const timeCubeAddress = process.env.timeCubeAddress;

// const Moralis = require("moralis/node");
const Web3 = require("web3");
const fs = require("fs");
const Contract = require("web3-eth-contract");
//const Tx = require('ethereumjs-tx').Transaction;

// Moralis.start({ serverUrl, appId });

const web3 = new Web3(new Web3.providers.HttpProvider("https://nd-403-110-561.p2pify.com/dd4287180d2d299318a50402bcc4398d/ext/bc/C/rpc"));

const NBT_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/BookTradable.json", "utf8")
);
const market_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/MarketPlace.json", "utf8")
);
const CC_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/CultureCoin.json", "utf8")
);
const TGK_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/TheGoldenKeys.json", "utf8")
);
const press_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/PrintingPress.json", "utf8")
);
const GU_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/GamblersUnionBEN.json", "utf8")
);

const BS_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/BaseSpells.json", "utf8")
);
const BL_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/BaseLoot.json", "utf8")
);
const items_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/MyItems.json"),
  "utf8"
);
const hero_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/Hero.json", "utf8")
);
const TC_abi = JSON.parse(
  fs.readFileSync("/home/john/bakerydemo/brownie/TimeCube.json", "utf8")
);

const premiumGas = process.env.premiumGas;
const regularGas = process.env.regularGas;

const gw100 = web3.utils.toWei("25.01", "gwei");
const gw25 = web3.utils.toWei("25.001", "gwei");
const gw10 = web3.utils.toWei("25.0001", "gwei");

////////////\\\\\\\\\\
//    Secure Codes
////////////\\\\\\\\\\

const metakeycontent = cCAPrivateKeyEncrypted.split(":");
const metakeycon = { iv: metakeycontent[0], content: metakeycontent[1] };
//console.debug("DEBUG:", metakeycon);

if (unsafePassword === "production") {
  if (cCAPrivateKey === "encrypted") {
    console.debug("Looks like password and key are production ready.");
  } else {
    console.debug(
      "Set cCAPrivateKey to >>encrypted<< to make the site run properly."
    );
  }
} else {
  const cCAPrivateKey = decrypt(unsafePassword, metakeycon);
  //console.debug("DEBUG: cCAPrivateKey: ", cCAPrivateKey);
  tools.cCAPrivateKey = cCAPrivateKey;
}

async function recover(msg, sig) {
  const bufObj = Buffer.from(msg, "base64");
  const decodedString = bufObj.toString("utf8");
  console.log("Decoded msg: ", decodedString);
  const address = web3.eth.accounts.recover(decodedString, sig);
  console.log("Recovered sender address: ", address);
  return address;
}

async function getTotalSupply(_contractid) {
  const contract = new web3.eth.Contract(NBT_abi, _contractid);
  const totalsupply = await contract.methods.totalSupply().call();

  return totalsupply;
}

async function getTotalSupply2(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.totalSupply().encodeABI();
  //const functionCall = contract.methods.setProxyRegistryAddress(cCA).encodeABI();
  transactionBody = {
    to: _contractid,
    data: functionCall,
    nonce: nonceOperator,
    gas: regularGas,
    gasPrice: gw100,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
  return retval;
}

async function getContractOwner(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const owner = await contract.methods.owner().call();
  console.log(owner);

  return owner;
}

async function getTokenOwner(_contractid, _tokenid) {
  const contract = new Contract(NBT_abi, _contractid);
  const owner = await contract.methods.ownerOf({ tokenId: _tokenid }).call();
  console.log(owner);
  return owner;
}

async function foooooo() {
  const contract = new Contract(NBT_abi, _contractid);
  const owner = await contract.methods.ownerOf({ tokenId: _tokenid }).call();
  console.log(owner);

  return owner;
}

async function getRoyalty(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const royalty = await contract.methods.getRoyalty().call();
  return royalty;
}

async function getDefaultFrom(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const res = await contract.methods.getDefaultFrom().call();
  return res;
}

async function getDefaultPrice(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const res = await contract.methods.getDefaultPrice().call();
  return res;
}

async function getProxyRegistryAddress(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const p = await contract.methods.getProxyRegistryAddress().call();
  return p;
}

async function getGasToken(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const token = await contract.methods.getGasToken().call();
  return token;
}

async function getContractRewards(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const res = await contract.methods.getRewards({ _tokenId: "0" }).call();
  return res;
}

async function registerMeme(_contractid, _meme) {
  const cultureCoin = new Contract(CC_abi, cultureCoinAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = cultureCoin.methods
    .register(_meme, "37000000", cCA)
    .encodeABI();
  transactionBody = {
    to: cultureCoinAddress,
    data: functionCall,
    nonce: nonceOperator,
    gas: premiumGas,
    gasPrice: gw10,
  };

  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function getMeme(_meme) {
  if (true) {
    // if (false) {
    //   /* This code doesn't work on moralis because debug is :::: function debug() public {
    //     			clownsearch();
    //     			emit HWarn("DEBUG:", "clownsearch() was called and was not payable. Yikes. Something must really be wrong.");
    //     			emit DebugUINT(myNOOPICO);
    // 			      } */

    //   console.log("in getMeme");
    //   const options = {
    //     chain: baseNetwork,
    //     address: cultureCoinAddress,
    //     function_name: "debug",
    //     abi: CC_abi,
    //     //params: {_meme: _meme}
    //     params: {},
    //   };
    //   const res = await Moralis.Web3API.native.runContractFunction(options);
    //   console.log(res);
    //   return res;
    // }

    if (false) {
      console.log("trying with web3");
      const contract = new Contract(CC_abi, cultureCoinAddress);
      const nonceOperator = web3.eth.getTransactionCount(cCA);
      const functionCall = contract.methods.debug().encodeABI();
      const transactionBody = {
        to: cultureCoinAddress,
        data: functionCall,
        nonce: nonceOperator,
        gas: premiumGas,
        gasPrice: gw10,
      };

      signedTransaction = await web3.eth.accounts.signTransaction(
        transactionBody,
        cCAPrivateKey
      );
      console.log("signedtx: ", signedTransaction);
      const retval = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      console.log("retval: ", retval);
      return retval;
    }

    if (true) {
      //From moraliswweb3.js: console.log("closeOffering: " + offeringId + " price: " + priceEncoded)
      const encodedFunction = web3.eth.abi.encodeFunctionCall(
        {
          name: "debug",
          type: "function",
          inputs: [{}],
        },
        []
      ); // End encodedFunction // Please careful injecting code into the stream.

      const transactionParameters = {
        to: cultureCoinAddress,
        from: cCA,
        value: "210100027000000000000000000",
        data: encodedFunction,
      };
      //const txt = await ethereum.request({
      // 	method: 'eth_sendTransaction',
      //	params: [transactionParameters]
      //});
      //return txt
      return;
    }
  }

//   const options = {
//     chain: baseNetwork,
//     address: cultureCoinAddress,
//     function_name: "getCoin",
//     abi: CC_abi,
//     params: { _meme: _meme },
//   };
//   const res = await Moralis.Web3API.native.runContractFunction(options);
//   return res;
}

async function registerMemeWithTx(_contractid, _meme) {
  console.log("registerMeme: ", _contractid, _meme);
  const cultureCoin = new Contract(CC_abi, cultureCoinAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = cultureCoin.methods
    .register(_meme, "37000000", cCA)
    .encodeABI();
  transactionBody = {
    to: cultureCoinAddress,
    data: functionCall,
    nonce: nonceOperator,
    gas: premiumGas,
    gasPrice: gw10,
  };

  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function setGasToken(_contractid) {
  const contract = new Contract(NBT_abi, _contractid);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .setGasToken(cultureCoinAddress)
    .encodeABI();
  transactionBody = {
    to: _contractid,
    _gasToken: cultureCoinAddress,
    data: functionCall,
    nonce: nonceOperator,
    gas: regularGas,
    gasPrice: gw10,
  };

  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function getMsgSender(_hostContract) {
  const contract = new Contract(NBT_abi, _hostContract);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.getMsgSender().encodeABI();
  transactionBody = {
    to: _hostContract,
    data: functionCall,
    nonce: nonceOperator,
    gas: premiumGas,
    gasPrice: gw100,
  };

  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
  return retval;
}

async function getMarketPlaceFrom(_contract) {
  const contract = new Contract(NBT_abi, _contract);
  const market = await contract.methods.getProxyRegistryAddress().call();
  return market;
}

async function setMarketPlace(cCAPrivateKey, _hostContract) {
  console.log("setMarketPlace: ", _hostContract);

  const contract = new Contract(NBT_abi, _hostContract);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .setProxyRegistryAddress(marketPlaceAddress)
    .encodeABI();
  transactionBody = {
    to: _hostContract,
    data: functionCall,
    nonce: nonceOperator,
    gas: regularGas,
    gasPrice: gw25,
  };

  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function verifyRewardContract(
  _hostContract,
  _childContract,
  cCAPrivateKey
) {
  console.log("verifyRewardContract: " + _hostContract + " " + _childContract);

  const market = await getMarketPlaceFrom(_hostContract);
  if (market.toLowerCase() != marketPlaceAddress.toLowerCase()) {
    console.log("Need to set marketplace is top level contract.");
    await setMarketPlace(cCAPrivateKey, _hostContract);
  }

  const contract = new Contract(NBT_abi, _childContract);
  const isAddon = await contract.methods.getAddon({ _addon: _hostContract }).call();
  if (!isAddon) {
    console.log("setting parent as child's addon: ", _hostContract);
    const contract = new Contract(NBT_abi, _childContract);
    const nonceOperator = web3.eth.getTransactionCount(cCA);
    const functionCall = contract.methods
      .setAddon(_hostContract, true)
      .encodeABI();
    transactionBody = {
      to: _childContract,
      nonce: nonceOperator,
      data: functionCall,
      gas: regularGas,
      gasPrice: gw100,
    };
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionBody,
      cCAPrivateKey
    );
    console.log(signedTransaction);
    const retval = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    console.log(retval);
  }

  //const p = await getProxyRegistryAddress(_hostContract);
  //console.log("cCA: ", p);
  //const royalty = await getRoyalty(_hostContract);
  //console.log("royalty: ", royalty);
  //const owner = await getContractOwner(_hostContract);
  //console.log("owner: ", owner);

  //console.log(await getMsgSender(_hostContract));

  const currentReward = await getContractRewards(_hostContract);
  console.log(
    "currentReward: ",
    currentReward[0],
    "\\/ Should be same as below."
  );
  console.log("childContract: ", _childContract, "<--- should be");
  console.log("cCA: ", cCA);

  if (currentReward[0].toLowerCase() != _childContract.toLowerCase()) {
    console.log("trying to set child contract; other than current");
    const contract = new Contract(NBT_abi, _hostContract);
    const nonceOperator = web3.eth.getTransactionCount(cCA);
    const functionCall = contract.methods
      .setRewardContract(_childContract)
      .encodeABI();
    //const functionCall = contract.methods.setProxyRegistryAddress(cCA).encodeABI();
    transactionBody = {
      to: _hostContract,
      data: functionCall,
      nonce: nonceOperator,
      gas: regularGas,
      gasPrice: gw100,
    };
    signedTransaction = await web3.eth.accounts.signTransaction(
      transactionBody,
      cCAPrivateKey
    );
    const retval = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    console.log(retval);
  } else {
    console.log("trying to set child contract; same as current");
  }
}

async function transferOwner(_contractid, _to) {
  const owner = await getContractOwner(_contractid);
  console.log("owner: ", _to);
  console.log("owner: " + owner);
  console.log("bookRA: " + cCA);

  const contract = new Contract(NBT_abi, _contractid);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.transferOwnership(_to).encodeABI();
  transactionBody = {
    to: _contractid,
    newOwner: _to,
    nonce: nonceOperator,
    data: functionCall,
    gas: regularGas,
    gasPrice: gw10,
  };

  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);

  const newOwner = await getContractOwner(_contractid);
  console.log("newOwner: " + newOwner);
}

async function safeTransferToken(contractid, oldOwner, newOwner, tokenId) {
  const contract = new Contract(NBT_abi, contractid);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .safeTransferFrom(oldOwner, newOwner, tokenId)
    .encodeABI();
  transactionBody = {
    to: contractid,
    newOwner: newOwner,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw10,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function retireMsg(msg, yesNo) {
  const contract = new Contract(TGK_abi, theGoldenKeysAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .setMemeBlacklist(msg, yesNo)
    .encodeABI();
  transactionBody = {
    to: theGoldenKeysAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: regularGas,
    gasPrice: gw25,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}

async function closeOffering(marketplace, offeringId) {
  /*
	const encodedFunction = web3.eth.abi.encodeFunctionCall({
                name: "closeOffering",
                type: "function",
                inputs: [
                        {type: 'bytes32',
                        name: '_offeringId'}]
        }, [offeringId]);

        const transactionParameters = {
                to: marketplace,
                from: ethereum.selectedAddress,
                value: priceEncoded,
                data: encodedFunction
        };
        const txt = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
        });
        return txt
	*/

  const contract = new Contract(market_abi, marketplace);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.closeOffering(offeringId).encodeABI();
  transactionBody = {
    to: offeringid,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw10,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );

  console.log(retval);
  return retval;
}

async function placeOffering(
  marketplace,
  offerer,
  hostContract,
  tokenId,
  price
) {
  const contract = new Contract(market_abi, marketplace);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .placeOfferingOperator(offerer, hostContract, tokenId, price)
    .encodeABI();
  transactionBody = {
    to: marketplace,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw10,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );

  console.log(retval);
  return retval;
}

async function viewOfferingNFT(marketplaceid, offeringId) {
  const contract = new Contract(market_abi, marketplaceid);
  const isAddon = await contract.methods.viewOfferingNFT({ _offeringId: offeringId }).call();
  return res;
}

function readFile(fileName) {
  const file = fs.readFileSync(fileName, "utf8");
  return file;
}

function writeFile(fileName, data) {
  fs.writeFileSync(fileName, data.toString(), "utf8");
}

function appendFile(fileName, data) {
  fs.appendFileSync(fileName, data.toString(), "utf8");
}

/* Do the exports. */
module.exports.readFile = readFile;
module.exports.writeFile = writeFile;
module.exports.appendFile = appendFile;

module.exports.recover = recover;

module.exports.getTotalSupply = getTotalSupply;
module.exports.getContractOwner = getContractOwner;
module.exports.getTokenOwner = getTokenOwner;

module.exports.transferOwner = transferOwner;
module.exports.safeTransferToken = safeTransferToken;

module.exports.getContractRewards = getContractRewards;
module.exports.verifyRewardContract = verifyRewardContract;

module.exports.getGasToken = getGasToken;
module.exports.setGasToken = setGasToken;
module.exports.getRoyalty = getRoyalty;
module.exports.getDefaultFrom = getDefaultFrom;
module.exports.getDefaultPrice = getDefaultPrice;

module.exports.closeOffering = closeOffering;
module.exports.viewOfferingNFT = viewOfferingNFT;
module.exports.placeOffering = placeOffering;

module.exports.registerMeme = registerMeme;
module.exports.registerMemeWithTx = registerMemeWithTx;
module.exports.getMeme = getMeme;

module.exports.web3 = web3;

module.exports.priceOfAVAX = priceOfAVAX;

//const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

async function priceOfAVAX() {
  const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331";
  const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
  const price = await priceFeed.methods.latestRoundData().call();
  console.log(price);
}

/* New stuff here... --jrr */

async function getMsgNonceError(msg) {
  const msgDecoded = Buffer.from(msg, "base64").toString("ascii");
  const myArray = msgDecoded.split(" ");
  //console.log(myArray);

  const msgNonce = await myArray[0];
  console.log("msg nonce: ", msgNonce);
  const nonceOperator = await web3.eth.getTransactionCount(cCA);

  let msgNonceNumber = BigInt(0);
  try {
    msgNonceNumber = BigInt(msgNonce);
  } catch (err) {
    //console.log("Error: ", err);
    console.log("Can't convert msgNonce to BigInt: ", msgNonce);
    return true;
  }
  console.log("msgNonceNumber: ", msgNonceNumber);
  console.log("nonceOperator: ", nonceOperator);

  if (
    msgNonceNumber < nonceOperator - nonceWindow ||
    msgNonce > nonceOperator
  ) {
    console.log("Nonce is not in the window.");
    return true;
  }
  return false;
}

async function getMessageRetirement(msg) {  
  const contract = new Contract(TGK_abi, theGoldenKeysAddress);
  const blacklisted = await contract.methods.getMemeBlacklist({ _meme: msg }).call();
  console.log(blacklisted);
  return blacklisted;
}

async function isSenderBlacklisted(sender) {
  console.log("isSenderBlacklisted: ", sender);
  const contract = new Contract(TGK_abi, theGoldenKeysAddress);
  const blacklisted = await contract.methods.getBlacklist({ _userAddress: sender }).call();
  console.log(blacklisted);
  return blacklisted;
}

async function isSenderAllowedBookAccess(
  contractid,
  msg,
  sig,
  tokenid,
  daedalusToken
) {
  const msgRetired = await getMessageRetirement(msg);
  if (msgRetired) {
    console.log("Message has been retired due to a blacklist.");
    return "Message has been retired due to a blacklist.";
  }

  const nonceError = await getMsgNonceError(msg);
  if (nonceError) {
    console.log("Message has been retired due to  nonce error.");
    return "Message has been retired due to a nonce error.";
  }

  const msgSender = await recover(msg, sig);
  const senderBlackedlisted = await isSenderBlacklisted(msgSender);
  if (senderBlackedlisted) {
    console.log("Sender is blacklisted.");
    return "Sender is blacklisted.";
  }

  if (daedalusToken != "0") {
    console.log("Daedalus token may be in play...");
    const daedalusTokenOwner = await getTokenOwner(
      daedalusClassBoosterAddress,
      daedalusToken
    );
    if (msgSender == daedalusTokenOwner) {
      console.log("Daedalus token owner is the same as the message sender.");
      return "true";
    }
  }

  const tokenOwner = await getTokenOwner(contractid, tokenid);
  if (msgSender == tokenOwner) {
    console.log("Sender is the owner of a daedalus token.");
    return "true";
  }

  return "Sender doesn't have the token.";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function newCultureCoinSeed(_meme) {
  const contract = new Contract(CC_abi, cultureCoinAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = (contract.methods.transactionBody = {
    to: _marketPlaceAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw100,
  });
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);

  // await :: getBookContract(_marketPlaceAddress);

  return retval;
}

async function testRecoverXMTSPFromCC(_amount) {
  const contract = new Contract(CC_abi, cultureCoinAddress);
  const nonceOperator = web3.eth.getTransactionCount(testAccountAddress);
  const functionCall = contract.methods.recover(_amount).encodeABI();
  transactionBody = {
    to: cultureCoinAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: regularGas,
    gasPrice: gw100,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    testPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function recoverXMTSPFromCC(_amount) {
  const contract = new Contract(CC_abi, cultureCoinAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.cloneMoney(_amount).encodeABI();
  transactionBody = {
    to: cultureCoinAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: regularGas,
    gasPrice: gw100,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);

  return retval;
}

async function newBookContract(
  _name,
  _symbol,
  _marketPlaceAddress,
  _baseuri,
  _burnable,
  _maxmint,
  _defaultprice,
  _defaultfrom,
  _mintTo,
  cCAPrivateKey
) {
  console.log("Creating new book contract...");
  console.log("_name: " + _name);
  console.log("_symbol: " + _symbol);
  console.log("_marketPlaceAddress: " + _marketPlaceAddress);
  console.log("_baseuri: " + _baseuri);
  console.log("_burnable: " + _burnable);
  console.log("_maxmint: " + _maxmint);
  console.log("_defaultprice: " + _defaultprice);
  console.log("_defaultfrom: " + _defaultfrom);
  console.log("_mintTo: " + _mintTo);
  console.log("cCAPrivateKey: " + cCAPrivateKey);

  console.log("cCA: ", cCA);
  console.log("printingPress: ", printingPressAddress);
  const contract = new Contract(press_abi, printingPressAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .newBookContract(
      _name,
      _symbol,
      _marketPlaceAddress,
      _baseuri,
      _burnable,
      _maxmint,
      _defaultprice,
      _defaultfrom,
      _mintTo
    )
    .encodeABI();
  transactionBody = {
    to: printingPressAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw100,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);

  return retval;
}

async function getIsPrinterAddon(_contractid) {  
  const contract = new Contract(NBT_abi, _contractid);
  const isAddon = await contract.methods.getAddon({ _addon: printingPressAddress }).call();
  console.log("isAddon: ", isAddon);

  return isAddon;
}

async function verifyPressIsCCMarket() {
  const contract = new Contract(CC_abi, cultureCoinAddress);
  const isAddon = await contract.methods.getAddon({ _addon: printingPressAddress }).call();

  return isAddon;
}

async function verifyAddon(_contract, _addon, _onOff) {
  const contract = new Contract(NBT_abi, _contract);
  const isAddon = await contract.methods.getAddon({ _addon: _addon }).call();
  console.log("isAddon: ", isAddon);

  if (isAddon != _onOff) {
    console.log("Have to set addon.");
    const contract = new Contract(NBT_abi, _contract);
    const nonceOperator = web3.eth.getTransactionCount(cCA);
    const functionCall = contract.methods.setAddon(_addon, _onOff).encodeABI();
    transactionBody = {
      to: _contract,
      nonce: nonceOperator,
      data: functionCall,
      gas: premiumGas,
      gasPrice: gw100,
    };
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionBody,
      cCAPrivateKey
    );
    console.log(signedTransaction);
    const retval = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    console.log(retval);
  }
}

async function ccApproveNewAddon(_addon, cCAPrivateKey) {
  console.log("ccApproveNewAddon: ", _addon);
  const contract = new Contract(CC_abi, cultureCoinAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.setAddon(_addon, true).encodeABI();
  transactionBody = {
    to: cultureCoinAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw25,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

async function setupAddonMarketPlace(cCAPrivateKey) {
  const contract = new Contract(CC_abi, cultureCoinAddress);
  const isAddon = await contract.methods.getAddon({ _addon: marketPlaceAddress }).call();

  if (!isAddon) {
    console.log("Approving market place...");
    await ccApproveNewAddon(marketPlaceAddress, cCAPrivateKey);
  } else {
    console.log("Market place already approved.");
  }
}

async function setupAddonPrintingPress(_contractid, cCAPrivateKey) {
  console.log("setupAddonPrintingPress for: ", _contractid);
  console.log("printingPressAddress: ", printingPressAddress);

  await setupAddonMarketPlace(cCAPrivateKey);

  const isPrintingPressCCApproved = await verifyPressIsCCMarket();
  console.log("isPrintingPressCCApproved: ", isPrintingPressCCApproved);
  if (isPrintingPressCCApproved == false) {
    console.log("Approving printing press...");
    await ccApproveNewAddon(printingPressAddress, cCAPrivateKey);
  } else {
    console.log("Heresville a goodsville.");
  }

  const isAddon = await getIsPrinterAddon(_contractid);
  if (isAddon) {
    console.log("already an addon");
    return "already an addon";
  }

  console.log("Setting up printer addon...");

  const contract = new Contract(NBT_abi, _contractid);
  //console.log("contract: ", contract.methods);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .setAddon(printingPressAddress, true)
    .encodeABI();
  transactionBody = {
    to: _contractid,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw100,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  return retval;
}
async function getPrintingPressBalance(_whom) {
  const contract = new Contract(press_abi, printingPressAddress);
  const B = await contract.methods.getAddon({ _whom: _whom }).call();
  console.log(B);

  return web3.utils.fromWei(B);
}

async function gasUpPrintingPress(_to, _amount) {
  console.log("gasUpPrintingPress: ", _to, _amount);
  console.log("printingPressAddress: ", printingPressAddress);
  console.log("cultureCoinAddress: ", cultureCoinAddress);

  console.log("current balance: ", await getPrintingPressBalance(_to));

  const contract = new Contract(press_abi, printingPressAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.addBalance(_to).encodeABI();
  transactionBody = {
    to: printingPressAddress,
    nonce: nonceOperator,
    data: functionCall,
    value: _amount,
    gas: premiumGas,
    gasPrice: gw100,
  };
  signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);

  balance = await getPrintingPressBalance(_to);
  //console.log("new balance: ", balance);
  return balance;
}

async function newContest(_NBT, _rightTokenId, _leftTokenId, _closeTime) {
  console.log("newContest: ", _NBT, _rightTokenId, _leftTokenId, _closeTime);
  const contract = new Contract(GU_abi, gamblersUnionAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods
    .newContest(_NBT, _rightTokenId, _leftTokenId, _closeTime)
    .encodeABI();
  transactionBody = {
    to: gamblersUnionAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: premiumGas,
    gasPrice: gw100,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}

// async function getBENWork(curLoc) {
//   const queryAll = new Moralis.Query(benPettingsTable);

//   console.log("curLoc:", curLoc);
//   queryAll.skip(Number(curLoc));

//   const data = await queryAll.find();
//   return data;

//   //console.log("queryAll" + JSON.stringify(queryAll));
//   console.log(data);

//   for (i = 0; i < data.length; i++) {
//     //console.log(data[i].attributes);

//     myprompt = data[i].get("prompt");
//     console.log("myprompt: ", myprompt);
//     tokenId = data[i].get("tokenId");
//     console.log("tokenId: ", tokenId);

//     value = web3.utils.fromWei(data[i].get("value"));

//     block_number = data[i].get("scratchId");
//     console.log("block_number: ", block_number);
//   }

//   return data;
// }

async function doSetAddon3(_contractAddress, _abi, _addon, _onOff) {
  const contract = new Contract(_abi, _contractAddress);
  const nonceOperator = web3.eth.getTransactionCount(cCA);
  const functionCall = contract.methods.setAddon(_addon, _onOff).encodeABI();
  transactionBody = {
    to: _contractAddress,
    nonce: nonceOperator,
    data: functionCall,
    gas: regularGas,
    gasPrice: gw100,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transactionBody,
    cCAPrivateKey
  );
  console.log(signedTransaction);
  const retval = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(retval);
}
async function isAddon3(_contractAddress, _abi, _theAddon) {
  console.log("isAddon3: ", _contractAddress, _theAddon);
  const contract = new Contract(_abi, _contractAddress);
  const isAddon = await contract.methods.getAddon({ _addon: _theAddon }).call();
  console.log("isAddon: ", isAddon);

  return isAddon;
}
/*  TimeCube test deploy code:
 *  items.setAddon(timeCube.address, True, {'from': accounts[0].address})
 *  loot.setAddon(timeCube.address, True, {'from': accounts[0].address})
 *  spells.setAddon(timeCube.address, True, {'from': accounts[0].address})
 *  heros.setAddon(timeCube.address, True, {'from': accounts[0].address}) */
async function verifyGameAddons() {
  console.log("verifyGameAddons");
  await verifyBaseLoot();
  await verifyHeros();
  await verifyTimeCube();
}
/* spells.setAddon(lootProxy.address, True, {'from': accounts[0].address}) */
async function verifyBaseLoot() {
  console.log("verifyBaseLoot");
  let isAddon = await isAddon3(baseSpellsAddress, BS_abi, baseLootAddress);
  console.log("isAddon: ", isAddon);
  if (isAddon == false) {
    await doSetAddon3(baseSpellsAddress, BS_abi, baseLootAddress, true);
  }
}
/* */
async function verifyBaseSpells() {
  console.log("verifyBaseSpells");
}
/* spells.setAddon(myItems.address, True, {'from': accounts[0].address}) */
async function verifyMyItems() {
  console.log("verifyMyItems");
  let isAddon = await isAddon3(baseSpellsAddress, BS_abi, myItemsAddress);
  console.log("isAddon: ", isAddon);
  if (isAddon == false) {
    console.log("setAddon: ", baseSpellsAddress);
    await doSetAddon3(baseSpellsAddress, BS_abi, myItemsAddress, true);
  }
}
/*
    CC.setAddon(hero.address, True, {'from': accounts[0].address})
    hero.setAddon(spells.address, True, {'from': accounts[0].address})
    hero.setAddon(loot.address, True, {'from': accounts[0].address})
    hero.setAddon(items.address, True, {'from': accounts[0].address})
    items.setAddon(hero.address, True, {'from': accounts[0].address}) */
async function verifyHeros() {
  console.log("verifyHeros");
  let isAddon = await isAddon3(heroAddress, hero_abi, baseSpellsAddress);
  console.log("spells isAddon: ", isAddon);
  if (isAddon == false) {
    console.log("setAddon: ", baseSpellsAddress);
    await doSetAddon3(heroAddress, hero_abi, baseSpellsAddress, true);
  }
  isAddon = await isAddon3(heroAddress, hero_abi, baseLootAddress);
  console.log("loot isAddon: ", isAddon);
  if (isAddon == false) {
    console.log("setAddon: ", baseLootAddress);
    await doSetAddon3(baseLootAddress, hero_abi, heroAddress, true);
  }
  isAddon = await isAddon3(heroAddress, hero_abi, myItemsAddress);
  console.log("items isAddon: ", isAddon);
  if (isAddon == false) {
    console.log("setAddon: ", myItemsAddress, heroAddress);
    await doSetAddon3(heroAddress, hero_abi, myItemsAddress, true);
  }

  const isItemsAddon = await isAddon3(myItemsAddress, items_abi, heroAddress);
  console.log("isItemsAddon: ", isItemsAddon);
  if (isItemsAddon == false) {
    console.log("Approving items addon...");
    await doSetAddon3(myItemsAddress, items_abi, heroAddress, true);
  }

  const isCCAddon = await isAddon3(cultureCoinAddress, CC_abi, heroAddress);
  console.log("isCCAddon: ", isCCAddon);
  if (isCCAddon == false) {
    console.log("Approving CC addon...");
    await doSetAddon3(cultureCoinAddress, CC_abi, heroAddress, true);
  }
}
/*  CC.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    items.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    loot.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    spells.setAddon(tcProxy.address, True, {'from': accounts[0].address})
*/
async function verifyTimeCube() {
  console.log("verifyTimeCube");
  console.log("Beginning items...");
  const isItemsAddon = await isAddon3(
    myItemsAddress,
    items_abi,
    timeCubeAddress
  );
  console.log("isItemsAddon: ", isItemsAddon);
  if (isItemsAddon == false) {
    console.log("Approving items addon...");
    await doSetAddon3(myItemsAddress, items_abi, timeCubeAddress, true);
  }

  console.log("Beginning loot...");
  const isLootAddon = await isAddon3(baseLootAddress, BL_abi, timeCubeAddress);
  console.log("isLootAddon: ", isLootAddon);
  if (isLootAddon == false) {
    console.log("Approving loot addon...");
    await doSetAddon3(baseLootAddress, BL_abi, timeCubeAddress, true);
  }

  console.log("Beginning spells...");
  const isSpellsAddon = await isAddon3(
    baseSpellsAddress,
    BS_abi,
    timeCubeAddress
  );
  console.log("isSpellsAddon: ", isSpellsAddon);
  if (isSpellsAddon == false) {
    console.log("Approving spells addon...");
    await doSetAddon3(baseSpellsAddress, BS_abi, timeCubeAddress, true);
  }

  console.log("Beginning heros...");
  const isHerosAddon = await isAddon3(heroAddress, hero_abi, timeCubeAddress);
  console.log("isHerosAddon: ", isHerosAddon);
  if (isHerosAddon == false) {
    console.log("Approving heros addon...");
    await doSetAddon3(heroAddress, hero_abi, timeCubeAddress, true);
  }
}

// async function cloudRun(_func, _args) {
//   return await Moralis.Cloud.run(_func, _args);
// }

module.exports.verifyGameAddons = verifyGameAddons;
module.exports.newContest = newContest;
module.exports.setupAddonPrintingPress = setupAddonPrintingPress;
module.exports.setupAddonMarketPlace = setupAddonMarketPlace;
module.exports.newBookContract = newBookContract;
module.exports.isSenderAllowedBookAccess = isSenderAllowedBookAccess;
module.exports.retireMsg = retireMsg;
module.exports.gasUpPrintingPress = gasUpPrintingPress;
module.exports.verifyAddon = verifyAddon;
// module.exports.getBENWork = getBENWork;
module.exports.sleep = sleep;
// module.exports.cloudRun = cloudRun;
module.exports.recoverXMTSPFromCC = recoverXMTSPFromCC;
module.exports.testRecoverXMTSPFromCC = testRecoverXMTSPFromCC;
module.exports.cCAPrivateKeyEncrypted = cCAPrivateKeyEncrypted;

const encrypt = (secretKey, text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (secretKey, hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
