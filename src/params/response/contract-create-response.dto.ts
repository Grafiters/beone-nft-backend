import { PaymentDetailsEntities } from '@db/entity/payment_details';
import { ApiProperty } from '@nestjs/swagger';

export class ContractCreateResponse {
  static async fromContract(contract: PaymentDetailsEntities) {
    const dto = new ContractCreateResponse();
    dto.hash = contract.hash;

    return dto;
  }

  @ApiProperty({ type: String })
  hash: string;
}
