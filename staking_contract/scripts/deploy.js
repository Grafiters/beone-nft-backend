async function main() {
  // This is just a convenience check
  if (!network.name) {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' + 'gets automatically created and destroyed every time. Use the Hardhat' + " option '--network localhost'"
    );
  }
  // run deploy
  // await Deploy();

  // run initialize
  await Initialize()
}

const Deploy = async () => {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying the contracts with the account:', await deployer.getAddress());
  console.log('Account balance:', (await deployer.getBalance()).toString());
  const _SmartChef = await ethers.getContractFactory('SmartChefInitializable');
  const SmartChef = await _SmartChef.deploy();
  await SmartChef.deployed();
  const SmartChefAddress = SmartChef.address;
  console.log('Pool address:', SmartChefAddress);
};

const Initialize = async () => {
  const currentBlock = await ethers.provider.getBlockNumber();

  const SmartChefAddress = '0x140Bbe8feE48b2F8ab656dc6237BE9D092F03aa1';
  const _stakedToken = '0x2aa054aa3d8aa69bbd51fa0f12c41b6bcbe69511';
  const _rewardToken = '0x2aa054aa3d8aa69bbd51fa0f12c41b6bcbe69511';
  const _rewardPerBlock = '10000000000';
  const _startBlock = currentBlock + 50;
  const _bonusEndBlock = 43783834;
  const _poolLimitPerUser = 0;
  const _numberBlocksForUserLimit = 0;
  const _admin = '0xd8de9359E807668dC808D70305ECe47Ecef7b7bD';
  const _lockStakedToken = 43783834;

  // ethers is available in the global scope
  const contract = await ethers.getContractAt('SmartChefInitializable', SmartChefAddress);
  const initialize = await contract.initialize(
    _stakedToken,
    _rewardToken,
    _rewardPerBlock,
    _startBlock,
    _bonusEndBlock,
    _poolLimitPerUser,
    _numberBlocksForUserLimit,
    _admin,
    _lockStakedToken,
    {
      gasPrice: ethers.utils.parseUnits('50', 'gwei'),
    }
  );
  await waitForTx(initialize.hash);
  console.log(`Initializing contract with hash ${initialize.hash}`);
};

const waitForTx = async (hash) => {
  const provider = ethers.provider;
  console.log(`Waiting for tx: ${hash}...`);
  while (!(await provider.getTransactionReceipt(hash))) {
    sleep(5000);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
