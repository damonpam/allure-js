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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const path = __importStar(require("path"));
const file_steps_1 = require("./file.steps");
const fs_extra_1 = require("fs-extra");
const chai_1 = __importDefault(require("chai"));
const chai_partial_1 = require("../support/chai-partial");
chai_1.default.use(chai_partial_1.ChaiPartial);
cucumber_1.When(/^I run cucumber-js with allure$/, { timeout: 10000 }, function () {
    const formatterPath = path.join(this.tmpDir, this.formatterPath);
    const formatterOutPath = path.join(this.tmpDir, this.formatterOutPath);
    return fs_extra_1.pathExistsSync(formatterPath)
        ? this.run()
        : file_steps_1.makeFormatterFile(formatterPath, formatterOutPath).then(() => this.run());
});
cucumber_1.Then(/^it passes$/, () => { });
//# sourceMappingURL=cucumber.steps.js.map