"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedStep = exports.CucumberAllureInterface = void 0;
const allure_js_commons_1 = require("allure-js-commons");
class CucumberAllureInterface extends allure_js_commons_1.Allure {
    constructor(reporter, runtime) {
        super(runtime);
        this.reporter = reporter;
    }
    get currentExecutable() {
        const result = this.reporter.currentStep || this.reporter.currentTest;
        if (result === null)
            throw new Error("No executable!");
        return result;
    }
    get currentTest() {
        if (this.reporter.currentTest === null)
            throw new Error("No test running!");
        return this.reporter.currentTest;
    }
    startStep(name) {
        const allureStep = this.currentExecutable.startStep(name);
        this.reporter.pushStep(allureStep);
        return new WrappedStep(this.reporter, allureStep);
    }
    step(name, body) {
        const wrappedStep = this.startStep(name);
        let result;
        try {
            result = wrappedStep.run(body);
        }
        catch (err) {
            wrappedStep.endStep();
            throw err;
        }
        if (allure_js_commons_1.isPromise(result)) {
            const promise = result;
            return promise.then(a => {
                wrappedStep.endStep();
                return a;
            }).catch(e => {
                wrappedStep.endStep();
                throw e;
            });
        }
        else {
            wrappedStep.endStep();
            return result;
        }
    }
    logStep(name, status) {
        this.step(name, () => { });
    }
    attachment(name, content, options) {
        const file = this.reporter.writeAttachment(content, options);
        this.currentExecutable.addAttachment(name, options, file);
    }
    testAttachment(name, content, options) {
        const file = this.reporter.writeAttachment(content, options);
        this.currentTest.addAttachment(name, options, file);
    }
    addParameter(name, value) {
        this.currentTest.addParameter(name, value);
    }
    addLabel(name, value) {
        this.currentTest.addLabel(name, value);
    }
    addIssueLink(url, name) {
        this.currentTest.addIssueLink(url, name);
    }
    addTmsLink(url, name) {
        this.currentTest.addTmsLink(url, name);
    }
}
exports.CucumberAllureInterface = CucumberAllureInterface;
class WrappedStep {
    constructor(reporter, step) {
        this.reporter = reporter;
        this.step = step;
    }
    startStep(name) {
        const step = this.step.startStep(name);
        this.reporter.pushStep(step);
        return new WrappedStep(this.reporter, step);
    }
    endStep() {
        this.reporter.popStep();
        this.step.endStep();
    }
    run(body) {
        return this.step.wrap(body)();
    }
}
exports.WrappedStep = WrappedStep;
//# sourceMappingURL=CucumberAllureInterface.js.map