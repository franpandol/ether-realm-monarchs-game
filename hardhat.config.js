require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
const { alchemyApiKey, mnemonic, account } = require('./secrets.json');

module.exports = {
  solidity: "0.8.20",
  networks: {
     ropsten: {
       url: alchemyApiKey,
       accounts: [account,],
       gas: "auto",
     },
  },
};
