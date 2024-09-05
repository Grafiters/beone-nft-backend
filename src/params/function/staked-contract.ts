export class PaymentDtoParams {
  user_id: number;
  hash: string;
}

export class StakedContractInitialize {
  user_id: number;
  contract_address: string;
  name: string | null;
  symbol: string | null;
  staked_token: string;
  reward_token: string;
  reward_per_block: string;
  start_block: number;
  bonus_end_block: number;
  status: string;
}
