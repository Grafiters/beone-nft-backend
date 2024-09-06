import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigServices } from '../../db/models/config/config.service';
import {
  FetchPaymentTransaction,
  TransactionData,
} from '@params/function/blockchain-params';
import Web3 from 'web3';
import InputDataDecoder from 'ethereum-input-data-decoder';
import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private base_factor: Decimal = new Decimal(Math.pow(10, 18));
  private web3: Web3;

  private readonly abiJsonFile: string = path.join(
    __dirname,
    '../../cra-abi.json',
  );

  constructor(private readonly configServices: ConfigServices) {}

  async fetchTransactionPayment(
    tf: FetchPaymentTransaction,
  ): Promise<TransactionData | null> {
    this.logger.debug(`start to create staked contract address ${tf.hash}`);
    await this.web3Init(tf.provider);

    let data: TransactionData;
    const transaction = await this.web3.eth.getTransaction(tf.hash);
    if (transaction) {
      const decoder = new InputDataDecoder(this.abiJsonFile);
      const result = decoder.decodeData(transaction.input);
      const toaddress = '0x' + result.inputs[0];
      const receipt = await this.web3.eth.getTransactionReceipt(tf.hash);
      if (typeof result.inputs[1] !== 'string') {
        const amount = result.inputs[1].toLocaleString('fullwide', {
          useGrouping: false,
        });

        const exacly_amount = this.convert_from_base(amount);
        data = {
          hash: transaction.hash,
          from: transaction.from,
          to: toaddress,
          amount: exacly_amount,
          contract_address: transaction.to,
          status: receipt.status,
        };
      }
    } else {
      return null;
    }

    this.logger.debug(`done to create staked contract address ${tf.hash}`);

    return data;
  }

  async deploySmartContract(): Promise<string> {
    return 'data';
  }

  async web3Init(provider: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
  }

  convert_from_base(amount: BigNumber): Decimal {
    return new Decimal(amount.toFixed()).div(this.base_factor);
  }

  async configurationData(params: string): Promise<string | null> {
    const configs = await this.configServices.findConfig(params);
    if (configs) {
      return configs.value;
    } else {
      return null;
    }
  }

  loadAbiJson(): any {
    const rawData = fs.readFileSync(this.abiJsonFile, 'utf-8');

    const abi = {
      cra: JSON.parse(rawData),
    };

    return abi;
  }
}
