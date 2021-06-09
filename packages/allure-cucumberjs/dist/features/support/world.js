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
const stream_1 = require("stream");
const verror_1 = __importDefault(require("verror"));
const path = __importStar(require("path"));
const glob_1 = __importDefault(require("glob"));
const fs = __importStar(require("fs-extra"));
const getAllureReport = reportPath => {
    const allureReport = { testResults: [] };
    const files = glob_1.default.sync(path.join(reportPath, "/*-result.json"));
    files.forEach(file => {
        const content = fs.readJSONSync(file);
        allureReport.testResults.push(content);
    });
    return allureReport;
};
class AllureWorld {
    constructor() {
        this.tmpDir = "";
        this.formatterPath = "support/allure-formatter.ts";
        this.formatterOutPath = "../out/allure-results";
        this.allureReport = { testResults: [] };
        this.result = { stdout: "", stderr: "", error: "" };
    }
    async run() {
        const formatterPath = path.join(this.tmpDir, this.formatterPath);
        const formatterOutPath = path.join(this.tmpDir, this.formatterOutPath);
        const argv = ["", "", "--backtrace", "--require-module=ts-node/register", `--format=${formatterPath}:.dummy.txt`];
        const cwd = this.tmpDir;
        let error;
        let stdout = "";
        let stderr = "";
        const stdoutStream = new stream_1.PassThrough();
        stdoutStream.on("readable", () => {
            let chunk;
            while ((chunk = stdoutStream.read())) {
                stdout += Buffer.concat([chunk]).toString("utf8");
            }
        });
        const cucumberClient = new cucumber_1.Cli({ argv: argv, cwd: cwd, stdout: stdoutStream });
        try {
            const { success } = await cucumberClient.run();
            if (!success) {
                error = new Error("CLI exited with non-zero");
            }
        }
        catch (err) {
            error = err;
            stderr = verror_1.default.fullStack(error);
        }
        stdoutStream.end();
        this.allureReport = getAllureReport(formatterOutPath);
        this.result = { stdout, stderr, error };
    }
}
cucumber_1.setWorldConstructor(AllureWorld);
//# sourceMappingURL=world.js.map