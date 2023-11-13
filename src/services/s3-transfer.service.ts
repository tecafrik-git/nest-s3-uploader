import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { lookup } from 'mime-types';
import { parse } from 'url';
import { FileSignedUrlInput, S3_OPERATION } from 'src/dto/s3-uploader.dto';
import { MODULE_OPTIONS_TOKEN } from 'src/s3-uploader.module-definition';
import { S3UploaderModuleOptions } from 'src/s3-uploader.module-options';

@Injectable()
export class S3TransferService {
  s3Client: S3;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private moduleOptions: S3UploaderModuleOptions,
  ) {
    this.s3Client = new S3({
      region: this.moduleOptions.region,
      signatureVersion: 'v4',
      credentials: {
        accessKeyId: this.moduleOptions.accessKeyId,
        secretAccessKey: this.moduleOptions.secretAccessKey,
      },
    });
  }

  async getPresignedUrl(
    args: FileSignedUrlInput,
  ): Promise<{ url: string; key: string }> {
    const { operation } = args;
    return {
      key: args.key,
      url: await this.s3Client.getSignedUrlPromise(operation, {
        Bucket: args.bucket || this.moduleOptions.bucket,
        Key: args.key,
        // 24 hours for get requests, 1 hour for put
        Expires:
          operation === S3_OPERATION.getObject ? 24 * 60 * 60 : 1 * 60 * 60,
        ResponseContentType:
          operation === S3_OPERATION.getObject ? lookup(args.key) : undefined,
        ResponseContentDisposition:
          operation === S3_OPERATION.getObject ? 'inline;' : undefined,
      }),
    };
  }

  async signUrl(unsignedUrl: string) {
    if (unsignedUrl.includes('s3')) {
      const parsedPath = parse(unsignedUrl);
      const documentKey = parsedPath.pathname?.slice(1);
      const bucket = parsedPath.host?.split('.')[0];
      if (!documentKey) {
        return unsignedUrl;
      }
      const signingResult = await this.getPresignedUrl({
        key: documentKey,
        operation: S3_OPERATION.getObject,
        bucket,
      });
      return signingResult.url;
    }
    return unsignedUrl;
  }
}
