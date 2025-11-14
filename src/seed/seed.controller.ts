import { Controller, Get, Param } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get('/:cantidad')
  executeSeed( @Param('cantidad') cantidad: string) {
    return this.seedService.executeSeed(+cantidad);
  }

}
