async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const { ethers, upgrades } = require("hardhat");

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  // deploy upgradeable contract
  const Monarchs = await ethers.getContractFactory("Monarchs");
  const monarchs  = await upgrades.deployProxy(Monarchs, []);
  const monarchsContract = await monarchs.waitForDeployment(); 
  const proxyAddress = await monarchsContract.getAddress();
  console.log("Monarchs Proxy deployed to:", proxyAddress);
  const currentImplAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Monarchs Implementation deployed to:", currentImplAddress);
  // We also save the contract's artifacts and addresses in the frontend directory
  saveFrontendFiles(monarchsContract);
}

function saveFrontendFiles(monarchsContract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../contracts_build";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Monarchs: monarchsContract.address}, undefined, 2)
  );

  const MonarchsArtifact = artifacts.readArtifactSync("Monarchs");

  fs.writeFileSync(
    contractsDir + "/Monarchs.json",
    JSON.stringify(MonarchsArtifact, null, 2)
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
