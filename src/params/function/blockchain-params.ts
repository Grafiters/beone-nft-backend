import Decimal from 'decimal.js';

export class FetchPaymentTransaction {
  hash: string;
  provider: string;
}

export class TransactionData {
  hash: string;
  status: boolean | null;
  from: string;
  to: string;
  contract_address: string;
  amount: Decimal;
}
