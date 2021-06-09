"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFormatterFile = void 0;
const cucumber_1 = require("cucumber");
const fs_extra_1 = require("fs-extra");
const path = __importStar(require("path"));
const makeFormatterFile = (formatterPath, formatterOutPath, config = "{}") => {
    const formatter = `
  import { CucumberJSAllureFormatter } from "../../../../src/CucumberJSAllureReporter";
  import {AllureRuntime} from "allure-js-commons";

  export default class Reporter extends CucumberJSAllureFormatter {
    constructor(options: any) {
      super(
        options,
        new AllureRuntime({ resultsDir: "${formatterOutPath}" }), ${config}
      );
    }
  }`;
    return fs_extra_1.outputFile(formatterPath, formatter);
};
exports.makeFormatterFile = makeFormatterFile;
cucumber_1.Given(/^a feature file "(.*)":$/, function (fileName, fileContent) {
    const absoluteFilePath = path.join(this.tmpDir, "features", fileName);
    return fs_extra_1.outputFile(absoluteFilePath, fileContent);
});
cucumber_1.Given(/^a feature:$/, function (fileContent) {
    const fileName = "example.feature";
    const absoluteFilePath = path.join(this.tmpDir, "features", fileName);
    return fs_extra_1.outputFile(absoluteFilePath, fileContent);
});
cucumber_1.Given(/^a allure formatter file$/, function () {
    const formatterPath = path.join(this.tmpDir, this.formatterPath);
    const formatterOutPath = path.join(this.tmpDir, this.formatterOutPath);
    return exports.makeFormatterFile(formatterPath, formatterOutPath);
});
cucumber_1.Given(/^a allure formatter file with config:$/, function (config) {
    const formatterPath = path.join(this.tmpDir, this.formatterPath);
    const formatterOutPath = path.join(this.tmpDir, this.formatterOutPath);
    return exports.makeFormatterFile(formatterPath, formatterOutPath, config);
});
//# sourceMappingURL=file.steps.js.map