declare class ExcludingFieldsHelper {
    exclude<T, Key extends keyof T>(object: T, keys: Key[]): Omit<T, Key>;
}
export declare const excludingFieldsHelper: ExcludingFieldsHelper;
export {};
