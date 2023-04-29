"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: process.env.JWT_SECRET || 'JWT_SECRET',
    secretRefresh: process.env.JWT_SECRET_REFRESH || 'JWT_SECRET_REFRESH',
};
//# sourceMappingURL=constants.js.map