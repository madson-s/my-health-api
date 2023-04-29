import { Injectable } from '@nestjs/common';

@Injectable()
export class FieldService {
  exclude<T, Key extends keyof T>(object: T, keys: Key[]): Omit<T, Key> {
    for (const key of keys) {
      delete object[key];
    }
    return object;
  }
}
