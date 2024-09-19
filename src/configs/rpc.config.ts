export interface RpcConfig {
  rpcUrl: string;
  chainId: number;
  explorer: string;
  privateKey: string;
}

export const rpcConfig = (): RpcConfig => {
  const network = process.env.NETWORK || 'mainnet';
  switch (network) {
    case 'testnet':
      return {
        rpcUrl: process.env.TESTNET_RPC_URL,
        chainId: parseInt(process.env.TESTNET_CHAINID, 0),
        explorer: process.env.TESTNET_EXPORER,
        privateKey: process.env.TESTENT_PRIVATE_KEY_DEPLOYER,
      };
    case 'mainnet':
      return {
        rpcUrl: process.env.MAINNET_RPC_URL,
        chainId: parseInt(process.env.MAINNET_CHAINID, 0),
        explorer: process.env.MAINNET_EXPORER,
        privateKey: process.env.MAINNET_PRIVATE_KEY_DEPLOYER,
      };
    default:
      break;
  }
};
