import Decimal from 'decimal.js';

export enum StakedStatus {
  Pending = 'pending',
  Success = 'success',
}

export enum PaymentStatus {
  Pending = 'pending',
  Approved = 'approved',
}

export class PaymentDtoParams {
  user_id: number;
  hash: string;
  contract_address: string;
  from: string;
  to: string;
  amount: Decimal;
  status: PaymentStatus = PaymentStatus.Pending;
  payment_success_at: number | null;
}

export class StakedContractInitialize {
  user_id: number;
  payment_detail_id: number;
  hash_initialize: string | '';
  contract_address: string;
  locking: boolean = false;
  staked_token: string | null;
  reward_token: string | null;
  reward_per_block: string | null;
  start_block: number | 0;
  bonus_end_block: number | 0;
  status: StakedStatus = StakedStatus.Pending;
}

export class StakedContractCreate {
  user_id: number;
  payment_detail_id: number;
  contract_address: string;
}

export class TokenStaked {
  address: string;
  chainId: number;
  symbol: string;
  name: string;
  decimals: string;
  projectLink: string = '';
}
