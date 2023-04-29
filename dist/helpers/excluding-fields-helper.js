"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludingFieldsHelper = void 0;
class ExcludingFieldsHelper {
    exclude(object, keys) {
        for (const key of keys) {
            delete object[key];
        }
        return object;
    }
}
exports.excludingFieldsHelper = new ExcludingFieldsHelper();
//# sourceMappingURL=excluding-fields-helper.js.map