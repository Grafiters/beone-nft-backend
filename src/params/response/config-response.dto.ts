import { ConfigEntities } from '@db/entity/configs.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigResponse {
  static async fromConfig(conf: ConfigEntities) {
    const dto = new ConfigResponse();
    dto.name = conf.name;
    dto.value = conf.value;

    return dto;
  }

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  value: string;
}
