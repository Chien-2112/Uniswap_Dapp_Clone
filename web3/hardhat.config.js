require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
      // forking: {
      //   url: process.env.ETHEREUM_MAINNET,
      //   blockNumber: 16000000
      // },
      accounts: {
        count: 10,
        initialBalance: "1000000" + "0".repeat(18)
      }
    },
  },
};