import { ArgumentMetadata, Injectable, ParseUUIDPipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptionalUUIDPipe
  implements PipeTransform<string | undefined, Promise<string | undefined>>
{
  private readonly pipe = new ParseUUIDPipe({ optional: true });

  async transform(
    value: string | undefined,
    metadata: ArgumentMetadata
  ): Promise<string | undefined> {
    if (value === undefined || value === '') {
      return undefined;
    }
    return this.pipe.transform(value, metadata);
  }
}
