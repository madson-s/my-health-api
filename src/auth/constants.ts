export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'JWT_SECRET',
  secretRefresh: process.env.JWT_SECRET_REFRESH || 'JWT_SECRET_REFRESH',
};
