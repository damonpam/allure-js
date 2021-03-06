"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllureWriter = void 0;
const path_1 = require("path");
const mkdirp_1 = require("mkdirp");
const fs_1 = require("fs");
const properties_1 = require("properties");
function writeJson(path, data) {
    fs_1.writeFileSync(path, JSON.stringify(data), { encoding: "utf-8" });
}
class AllureWriter {
    constructor(config) {
        this.config = config;
        if (!fs_1.existsSync(this.config.resultsDir)) {
            mkdirp_1.sync(this.config.resultsDir);
        }
    }
    buildPath(name) {
        return path_1.join(this.config.resultsDir, name);
    }
    writeAttachment(name, content) {
        const path = this.buildPath(name);
        fs_1.writeFileSync(path, content);
    }
    writeEnvironmentInfo(info) {
        const text = properties_1.stringify(info, { unicode: true }).toString();
        const path = this.buildPath("environment.properties");
        fs_1.writeFileSync(path, text);
    }
    writeCategoriesDefinitions(categories) {
        const path = this.buildPath("categories.json");
        writeJson(path, categories);
    }
    writeGroup(result) {
        const path = this.buildPath(`${result.uuid}-container.json`);
        writeJson(path, result);
    }
    writeResult(result) {
        const path = this.buildPath(`${result.uuid}-result.json`);
        writeJson(path, result);
    }
}
exports.AllureWriter = AllureWriter;
//# sourceMappingURL=AllureWriter.js.map