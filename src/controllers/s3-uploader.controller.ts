import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import {
  S3_OPERATION,
  FileUploadSignedUrlInput,
  MultiFileUploadSignedUrlInput,
} from 'src/dto/s3-uploader.dto';
import { S3TransferService } from 'src/services/s3-transfer.service';

class FileSignedUrl {
  url: string;
}

@Controller('/s3-uploader')
export class S3UploaderController {
  private logger = new Logger(S3UploaderController.name);
  constructor(private s3UploaderService: S3TransferService) {}

  @Post('/create-upload-url')
  async createUploadUrl(
    @Body('data') data: FileUploadSignedUrlInput,
  ): Promise<FileSignedUrl> {
    try {
      return await this.s3UploaderService.getPresignedUrl({
        key: data.key,
        operation: S3_OPERATION.putObject,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error getting signed url', 500);
    }
  }

  @Post('/create-multi-upload-urls')
  async createMultiUploadUrls(
    @Body('data') data: MultiFileUploadSignedUrlInput,
  ): Promise<Array<FileSignedUrl>> {
    try {
      const outputs = await Promise.all(
        data.files.map((file) =>
          this.s3UploaderService.getPresignedUrl({
            key: file.key,
            operation: S3_OPERATION.putObject,
          }),
        ),
      );
      return outputs;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error getting signed url', 500);
    }
  }
}
