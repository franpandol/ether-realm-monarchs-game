require('@nomiclabs/hardhat-ethers');
const { alchemyApiKey, mnemonic, account } = require('./secrets.json');

module.exports = {
  solidity: "0.8.4",
  networks: {
     ropsten: {
       url: alchemyApiKey,
       accounts: [account,],
       gas: "auto",
     },
  },
};
