"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayFail = exports.delayPass = void 0;
const cucumber_1 = require("cucumber");
const assert_1 = __importDefault(require("assert"));
function delayPass(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.delayPass = delayPass;
function delayFail(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error("Async error")), ms);
    });
}
exports.delayFail = delayFail;
cucumber_1.When("do passing step", () => { });
cucumber_1.When("do failing step", () => assert_1.default(false, "hello from failed step"));
cucumber_1.When("do async passing step", () => delayPass(10));
cucumber_1.When("do async failing step", () => delayFail(10));
cucumber_1.When("do ambiguous step", () => { });
cucumber_1.Then("do ambiguous step", () => { });
//# sourceMappingURL=dummy.steps.js.map