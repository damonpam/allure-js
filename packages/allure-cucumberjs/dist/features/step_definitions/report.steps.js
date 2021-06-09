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
const chai_1 = __importStar(require("chai"));
const cucumber_1 = require("cucumber");
const chai_partial_1 = require("../support/chai-partial");
chai_1.default.use(chai_partial_1.ChaiPartial);
cucumber_1.Then(/^it has result for "(.*)"$/, function (name) {
    chai_1.expect(this.allureReport.testResults).to.partial([{ name }]);
});
cucumber_1.When(/^I choose result for "(.*)"$/, function (name) {
    this.ctx = this.allureReport.testResults.find((result) => result.name == name);
});
cucumber_1.When(/^I choose step "(.*)"$/, function (name) {
    this.ctx = this.ctx.steps.find((step) => step.name == name);
});
cucumber_1.Then(/^it has step "(.*)"$/, function (name) {
    chai_1.expect(this.ctx).have.property("steps");
    chai_1.expect(this.ctx.steps).to.partial([{ name }]);
});
cucumber_1.Then(/^it has status "(passed|failed|skipped|broken|undefined)"$/, function (status) {
    chai_1.expect(this.ctx).to.partial({ status });
});
cucumber_1.Then(/^it has label "(.*)" with value "(.*)"$/, function (name, value) {
    chai_1.expect(this.ctx).partial({ labels: [{ name, value }] });
});
cucumber_1.Then(/^it has description "(.*)"$/, function (description) {
    chai_1.expect(this.ctx).partial({ description });
});
cucumber_1.Then(/^it has link with url "(.*)" with name "(.*)" and with type "(.*)"$/, function (url, name, type) {
    chai_1.expect(this.ctx).partial({ links: [{ url, name, type }] });
});
//# sourceMappingURL=report.steps.js.map