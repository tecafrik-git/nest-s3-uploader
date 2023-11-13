import { HttpException, Logger } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import {
  S3_OPERATION,
  FileUploadSignedUrlInput,
  MultiFileUploadSignedUrlInput,
} from 'src/dto/s3-uploader.dto';
import { S3TransferService } from 'src/services/s3-transfer.service';

@ObjectType()
class FileSignedUrl {
  @Field()
  url: string;
}

@Resolver()
export class S3UploaderResolver {
  private logger = new Logger(S3UploaderResolver.name);
  constructor(private s3UploaderService: S3TransferService) {}

  @Mutation(() => FileSignedUrl)
  async createUploadUrl(
    @Args('data') data: FileUploadSignedUrlInput,
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

  @Mutation(() => [FileSignedUrl])
  async createMultiUploadUrls(
    @Args('data') data: MultiFileUploadSignedUrlInput,
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
