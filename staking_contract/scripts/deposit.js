const CONTRACT_ADDRESS = '0x2aa054aa3d8aa69bbd51fa0f12c41b6bcbe69511';
const SmartChefAddress = '0x140Bbe8feE48b2F8ab656dc6237BE9D092F03aa1';
const AMOUNT_TO_DEPOSIT = '1000000000000000000';
const AMOUNT_DEPOSIT = '897977460200000000';
const AMOUNT_REWARD = '22539800000000';

async function main() {
  // test deposit
  await deposit()

  // test withdraw
  // await withdraw();

  // test updateStartAndEndBlocks
  // await updateStartAndEndBlocks();
}
async function deposit() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer address:', await deployer.getAddress());
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const token = await ethers.getContractAt('IERC20Metadata', CONTRACT_ADDRESS);
  const allowance = await token.allowance(deployer.getAddress(), SmartChefAddress);
  console.log(`Current allowance: ${ethers.utils.formatUnits(allowance, 18)} tokens`);
  if (allowance.lt(AMOUNT_TO_DEPOSIT)) {
    console.log(`Increasing allowance to ${ethers.utils.formatUnits(AMOUNT_TO_DEPOSIT, 18)} tokens...`);
    const txApprove = await token.approve(SmartChefAddress, AMOUNT_TO_DEPOSIT);
    console.log(`Approval transaction hash: ${txApprove.hash}`);
    await txApprove.wait();
    console.log('Allowance increased.');
  }
  const contract = await ethers.getContractAt('SmartChefInitializable', SmartChefAddress);
  console.log(`Depositing ${AMOUNT_TO_DEPOSIT.toString()} tokens to the contract...`);
  const tx = await contract.deposit(AMOUNT_TO_DEPOSIT);
  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);
  console.log('Deposit successful!');
}
async function withdraw() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer address:', await deployer.getAddress());
  const contract = await ethers.getContractAt('SmartChefInitializable', SmartChefAddress);
  console.log(`Withdrawn ${AMOUNT_TO_DEPOSIT.toString()} tokens to the contract...`);
  const amountPending = await contract.userInfo(deployer.getAddress());
  const tx = await contract.withdraw(amountPending);
  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);
  console.log('Withdraw successful!');
}

async function updateStartAndEndBlocks() {
  const currentBlock = await ethers.provider.getBlockNumber();
  console.log(currentBlock);
  const [deployer] = await ethers.getSigners();
  console.log('Deployer address:', await deployer.getAddress());
  const contract = await ethers.getContractAt('SmartChefInitializable', SmartChefAddress);
  console.log(`updateStartAndEndBlocks tokens to the contract...`);
  const tx = await contract.updateStartAndEndBlocks(parseInt(currentBlock + 100), 43783834);
  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);
  console.log('updateStartAndEndBlocks successful!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
