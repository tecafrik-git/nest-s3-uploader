import { Module } from '@nestjs/common';
import { S3UploaderController } from './controllers/s3-uploader.controller';
import { S3TransferService } from './services/s3-transfer.service';
import { S3UploaderResolver } from './resolvers/s3-uploader.resolver';
import { ConfigurableModuleClass } from './s3-uploader.module-definition';

@Module({
  controllers: [S3UploaderController],
  providers: [S3TransferService, S3UploaderResolver],
  exports: [S3TransferService],
})
export class S3UploaderModule extends ConfigurableModuleClass {}

export { S3TransferService };
