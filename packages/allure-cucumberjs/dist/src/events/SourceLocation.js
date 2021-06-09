"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceLocation = void 0;
class SourceLocation {
    static toKey(s) {
        return `${s.sourceLocation.uri}:${s.sourceLocation.line}`;
    }
}
exports.SourceLocation = SourceLocation;
//# sourceMappingURL=SourceLocation.js.map