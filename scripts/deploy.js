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


  const Wall = await ethers.getContractFactory("Monarchs");
  const wallContract = await Wall.deploy();
  await wallContract.deployed();

  console.log("Wall contract address:", wallContract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(wallContract);
}

function saveFrontendFiles(wallContract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../contracts_build";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Monarchs: wallContract.address }, undefined, 2)
  );

  const WallArtifact = artifacts.readArtifactSync("Monarchs");

  fs.writeFileSync(
    contractsDir + "/Monarchs.json",
    JSON.stringify(WallArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
