const tools = require("./tools");
const fs = require("fs");
const https = require("https");
const lockFile = require("lockfile");
const readline = require("readline");

const myArgs = process.argv.slice(2);
const portNum = myArgs[0];
const bindAddr = myArgs[1];
const remoteAddrs = process.argv.slice(4);
console.log("port: ", portNum);
console.log("addr: ", bindAddr);

process.on("SIGINT", () => {
  // FIXME: readline is catching the first control+c for some reason...
  process.exit();
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  rl.output.write(
    "\x1B[2K\x1B[200D" + "[" + (rl.line.length % 2 == 1 ? "=-" : "-=") + "]"
  );
};

rl.question("pass: ", (passPhrase) => {
  console.log(); // Because of ugliness and no time to put makeup on this hog. Dont delete until better password handling in in place.
  runServer(passPhrase);
});

function runServer(passPhrase) {
  const metakeycontent = tools.cCAPrivateKeyEncrypted.split(":");
  const metakeycon = { iv: metakeycontent[0], content: metakeycontent[1] };
  //console.debug("DEBUG:", metakeycon);

  const cCAPrivateKey = tools.decrypt(passPhrase, metakeycon);
  //console.debug("DEBUG: cCAPrivateKey: ", cCAPrivateKey);

  tools.cCAPrivateKey = cCAPrivateKey;

  const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
    passphrase: passPhrase,
  };

  const server = https.createServer(options, async (req, res) => {
    res.writeHead(200);

    console.log("remote: ", req.connection.remoteAddress);

    if (remoteAddrs.includes(req.connection.remoteAddress)) {
      console.log("Remote address is good.");
    } else {
      console.log("Remote address is bad.");
    }

    const restfulCmd = req.url.split("/");

    const address = restfulCmd[1]; // The contract address of interest
    console.log("address", address);
    const cmd = restfulCmd[2];
    console.log("cmd", cmd); // The command to run on it...

    if (cmd === "totalsupply") {
      try {
        ts = await tools.getTotalSupply(address);
        //res.send(ts);
        res.end(ts);
      } catch (e) {
        console.log("Error", e);
        //res.send(e);
        res.end(e);
      }
    } else if (cmd === "verifyrewards") {
      try {
        const child = restfulCmd[3];
        console.log("child", child);

        const verified = await tools.verifyRewardContract(
          address,
          child,
          cCAPrivateKey
        );
        let addonRet = await tools.setupAddonPrintingPress(
          address,
          cCAPrivateKey
        );

        addonRet = await tools.setupAddonPrintingPress(child, cCAPrivateKey);
        //res.send("verified");
        res.end("verified");
      } catch (e) {
        console.log("Error", e);
        //res.send(e);
        res.end(e);
      }
      //secureUri = "0x0" + "/newbookcontract/" + _name + "/" + _symbol+ "/" + _bookRegistryAddress + "#" + _baseuri + "#"
      //secureUri += _burnable + "/" + _maxmint + "/" + _defaultprice + "/" + _defaultfrom + "/" + _mintTo + "#" + whoFile
      // Contract is 0x0 for creation calls.
    }

    //res.end();
  });

  server.listen(portNum, bindAddr, () => {
    console.log(`Server running at http://${bindAddr}:${portNum}/`);
  });
}
