require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    compilers: [{ version: '0.8.17' }],
  },
  networks: {
    dev: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      chainId: 1503,
      gasPrice: 300000000,
      accounts: [
        '5c0cc4e229a9a1dd1a79441ad7b4c95608e68ffba885da50922c5f1dc96d713c',
      ],
    },
    bsc_test: {
      url: 'https://bsc-testnet-rpc.publicnode.com',
      chainId: 97,
      gasPrice: 3000000000,
      accounts: [
        '24975fd629a679e3baa4c7bca4607224011e844e7465982684066874e53c3647',
      ],
    },
  },
};
