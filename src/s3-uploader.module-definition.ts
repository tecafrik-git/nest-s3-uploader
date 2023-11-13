import { ConfigurableModuleBuilder } from '@nestjs/common';
import { S3UploaderModuleOptions } from './s3-uploader.module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<S3UploaderModuleOptions>().build();
