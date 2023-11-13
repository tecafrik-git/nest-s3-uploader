import { registerEnumType, InputType, Field } from '@nestjs/graphql';

export enum S3_OPERATION {
  putObject = 'putObject',
  getObject = 'getObject',
}
registerEnumType(S3_OPERATION, { name: 'S3_OPERATION' });

@InputType()
export class FileSignedUrlInput {
  @Field(() => S3_OPERATION)
  operation: S3_OPERATION;

  @Field(() => String)
  key: string;

  bucket?: string;
}

@InputType()
export class FileUploadSignedUrlInput {
  @Field(() => String)
  key: string;
}

@InputType()
export class MultiFileUploadSignedUrlInput {
  @Field(() => [FileUploadSignedUrlInput])
  files: Array<FileUploadSignedUrlInput>;
}

@InputType()
export class MultiFileSignedUrlInput {
  @Field(() => [FileSignedUrlInput])
  files: Array<FileSignedUrlInput>;
}
