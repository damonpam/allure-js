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
const cucumber_1 = require("cucumber");
const fs_extra_1 = require("fs-extra");
const path = __importStar(require("path"));
const projectPath = path.join(__dirname, "..", "..");
cucumber_1.Before(function ({ sourceLocation: { uri, line } }) {
    this.tmpDir = path.join(projectPath, "tmp", `${path.basename(uri)}_${line}`);
    const dummyStepsPath = path.join(__dirname, "..", "step_definitions/dummy.steps.js");
    fs_extra_1.copySync(dummyStepsPath, path.join(this.tmpDir, "/features/step_definitions/dummy.steps.js"));
});
cucumber_1.After(function () {
    const tmp = (this.tmpDir = path.join(projectPath, "tmp"));
    fs_extra_1.removeSync(tmp);
});
//# sourceMappingURL=hooks.js.map