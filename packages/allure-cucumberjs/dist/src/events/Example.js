"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examplesToSensibleFormat = exports.Example = void 0;
class Example {
    constructor() {
        this.line = 0;
        this.arguments = {};
    }
}
exports.Example = Example;
function examplesToSensibleFormat(examples) {
    const result = [];
    for (const table of examples) {
        for (const row of table.tableBody || []) {
            const item = new Example();
            item.line = row.location.line;
            for (let i = 0; i < row.cells.length; i++) {
                item.arguments[table.tableHeader.cells[i].value] = row.cells[i].value;
            }
            result.push(item);
        }
    }
    return result;
}
exports.examplesToSensibleFormat = examplesToSensibleFormat;
//# sourceMappingURL=Example.js.map