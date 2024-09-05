import { ConfigServices } from '@db/models/config/config.service';
import { UserService } from '@db/models/user/user.service';
import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('contract')
@Controller('contract')
export class ContractController {
  private readonly logger = new Logger(ContractController.name);
  constructor(
    private readonly userService: UserService,
    private readonly configServices: ConfigServices,
  ) {}
}
