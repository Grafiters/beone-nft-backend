import { plainToInstance as origPlainToInstance } from 'class-transformer';

export function plainToInstance<T>(
  constructor: new () => T,
  plain: Partial<T>,
): Promise<T> {
  return Promise.resolve(origPlainToInstance(constructor, plain));
}
