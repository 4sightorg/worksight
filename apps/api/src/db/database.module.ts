import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { WorksightRepository } from './worksight.repository';

@Global()
@Module({
  providers: [DatabaseService, WorksightRepository],
  exports: [DatabaseService, WorksightRepository],
})
export class DatabaseModule {}
