async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );


  const Monarchs = await ethers.getContractFactory("Monarchs");
  const monarchsContract = await Monarchs.deploy();
  await monarchsContract.deployed();


  // Create a promise to wait for the RoyalGuildCreated event
  const royalGuildPromise = new Promise((resolve, reject) => {
    monarchsContract.once("RoyalGuildCreated", (address) => {
      console.log("RoyalGuild contract address:", address);
      resolve(address);
    });
  });
  
  // Wait for the RoyalGuildCreated event to be emitted
  const royalGuildAddress = await royalGuildPromise;

  // We also save the contract's artifacts and addresses in the frontend directory
  saveFrontendFiles(monarchsContract, royalGuildAddress);
}

function saveFrontendFiles(monarchsContract, royalGuildAddress) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../contracts_build";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Monarchs: monarchsContract.address, RoyalGuild: royalGuildAddress }, undefined, 2)
  );

  const MonarchsArtifact = artifacts.readArtifactSync("Monarchs");
  const RoyalGuildArtifact = artifacts.readArtifactSync("RoyalGuild"); // Read the RoyalGuild artifact

  fs.writeFileSync(
    contractsDir + "/Monarchs.json",
    JSON.stringify(MonarchsArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/RoyalGuild.json",
    JSON.stringify(RoyalGuildArtifact, null, 2) // Save the RoyalGuild artifact
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
