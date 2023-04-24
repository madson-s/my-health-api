class ExcludingFieldsHelper {
  exclude<UserModel, Key extends keyof UserModel>(
    user: UserModel,
    keys: Key[],
  ): Omit<UserModel, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }
}

export const excludingFieldsHelper = new ExcludingFieldsHelper();
