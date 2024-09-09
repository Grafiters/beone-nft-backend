import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { rpcConfig, RpcConfig } from '../../configs/rpc.config';
import path from 'path';
import * as fs from 'fs';
import { StakedContractInitialize } from '@params/function/staked-contract';

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);
  private readonly rpcConfig: RpcConfig;

  constructor(private configService: ConfigService) {
    this.rpcConfig = rpcConfig();
  }

  async deploy(): Promise<string> {
    this.logger.debug(`start deploy smart contract`);
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
      this.rpcConfig.rpcUrl,
    );

    this.logger.debug(this.rpcConfig.privateKey);

    const wallet: ethers.Wallet = new ethers.Wallet(
      this.rpcConfig.privateKey,
      provider,
    );

    const abiPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'staking_contract',
      'artifacts',
      'contracts',
      'SmartChefInitializable.sol',
      'SmartChefInitializable.json',
    );

    const resultCompile = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

    const { abi, bytecode } = resultCompile;

    try {
      const factory = new ethers.ContractFactory(abi, bytecode, wallet);
      const contract = await factory.deploy();

      await contract.deploymentTransaction();

      const address = await contract.getAddress();

      this.logger.debug(`done deploy smart contract address ${address}`);
      return address;
    } catch (error) {
      this.logger.error(`errored when try to deploy contract cause ${error}`);
      return error;
    }
  }

  async initialize_contract(
    contracts: StakedContractInitialize,
  ): Promise<string> {
    this.logger.debug(
      `start initialize smart contract ${contracts.contract_address}`,
    );
    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
      this.rpcConfig.rpcUrl,
    );

    const wallet: ethers.Wallet = new ethers.Wallet(
      this.rpcConfig.privateKey,
      provider,
    );

    const abiPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'staking_contract',
      'artifacts',
      'contracts',
      'SmartChefInitializable.sol',
      'SmartChefInitializable.json',
    );

    const resultCompile = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

    try {
      const contract = await new ethers.Contract(
        contracts.contract_address,
        resultCompile.abi,
        wallet,
      );

      const tx = await contract.initialize(
        contracts.staked_token,
        contracts.reward_token,
        contracts.reward_per_block,
        contracts.start_block,
        contracts.bonus_end_block,
        0,
        0,
        wallet.address,
        {
          gasPrice: ethers.parseUnits('50', 'gwei'),
        },
      );

      await tx.wait();

      this.logger.debug(
        `initialize contract ${contracts.contract_address} success with hash ${tx.hash}`,
      );

      return tx.hash;
    } catch (error) {
      this.logger.error(`initialize contract errored cause ${error}`);
      return error;
    }
  }
}
