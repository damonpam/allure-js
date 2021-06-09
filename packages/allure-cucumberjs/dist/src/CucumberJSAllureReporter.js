"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CucumberJSAllureFormatter = exports.CucumberJSAllureFormatterConfig = exports.Allure = void 0;
const allure_js_commons_1 = require("allure-js-commons");
const cucumber_1 = require("cucumber");
const CucumberAllureInterface_1 = require("./CucumberAllureInterface");
const Example_1 = require("./events/Example");
const SourceLocation_1 = require("./events/SourceLocation");
const utilities_1 = require("./utilities");
var allure_js_commons_2 = require("allure-js-commons");
Object.defineProperty(exports, "Allure", { enumerable: true, get: function () { return allure_js_commons_2.Allure; } });
class CucumberJSAllureFormatterConfig {
}
exports.CucumberJSAllureFormatterConfig = CucumberJSAllureFormatterConfig;
class CucumberJSAllureFormatter extends cucumber_1.Formatter {
    constructor(options, allureRuntime, config) {
        super(options);
        this.allureRuntime = allureRuntime;
        this.currentAfter = null;
        this.currentBefore = null;
        this.currentGroup = null;
        this.currentTest = null;
        this.featureMap = new Map();
        this.sourceMap = new Map();
        this.stepStack = [];
        this.stepsMap = new Map();
        options.eventBroadcaster
            .on("source", this.onSource.bind(this))
            .on("gherkin-document", this.onGherkinDocument.bind(this))
            .on("test-case-prepared", this.onTestCasePrepared.bind(this))
            .on("test-case-started", this.onTestCaseStarted.bind(this))
            .on("test-step-started", this.onTestStepStarted.bind(this))
            .on("test-step-attachment", this.onTestStepAttachment.bind(this))
            .on("test-step-finished", this.onTestStepFinished.bind(this))
            .on("test-case-finished", this.onTestCaseFinished.bind(this));
        this.labels = config.labels || {};
        this.links = config.links || {};
        this.exceptionFormatter = function (message) {
            if (config.exceptionFormatter !== undefined) {
                try {
                    return config.exceptionFormatter(message);
                }
                catch (e) {
                    console.warn(`Error in exceptionFormatter: ${e}`);
                }
            }
            return message;
        };
        this.allureInterface = new CucumberAllureInterface_1.CucumberAllureInterface(this, this.allureRuntime);
        options.supportCodeLibrary.World.prototype.allure = this.allureInterface;
        this.beforeHooks = options.supportCodeLibrary.beforeTestCaseHookDefinitions;
        this.afterHooks = options.supportCodeLibrary.afterTestCaseHookDefinitions;
    }
    get currentStep() {
        if (this.stepStack.length > 0) {
            return this.stepStack[this.stepStack.length - 1];
        }
        return null;
    }
    onGherkinDocument(data) {
        data.document.caseMap = new Map();
        data.document.stepMap = new Map();
        if (data.document.feature !== undefined) {
            for (const test of data.document.feature.children || []) {
                test.stepMap = new Map();
                if (test.type === "Background") {
                    data.document.stepMap = new Map();
                    for (const step of test.steps) {
                        step.isBackground = true;
                        data.document.stepMap.set(step.location.line, step);
                    }
                }
                else {
                    for (const step of test.steps) {
                        test.stepMap.set(step.location.line, step);
                    }
                }
                if (test.type === "ScenarioOutline") {
                    for (const example of Example_1.examplesToSensibleFormat(test.examples || [])) {
                        const copy = Object.assign({}, test);
                        copy.example = example;
                        data.document.caseMap.set(example.line, copy);
                    }
                }
                else {
                    data.document.caseMap.set(test.location.line, test);
                }
            }
        }
        this.featureMap.set(data.uri, data.document);
    }
    onSource(data) {
        this.sourceMap.set(data.uri, data.data.split(/\n/));
    }
    onTestCaseFinished(data) {
        if (this.currentTest === null || this.currentGroup === null) {
            throw new Error("No current test info");
        }
        this.currentTest.status = utilities_1.statusTextToAllure(data.result.status);
        this.currentTest.stage = utilities_1.statusTextToStage(data.result.status);
        this.setException(this.currentTest, data.result.exception);
        this.currentTest.endTest();
        this.currentGroup.endGroup();
    }
    onTestCasePrepared(data) {
        this.stepsMap.clear();
        this.stepsMap.set(SourceLocation_1.SourceLocation.toKey(data), data.steps);
        this.currentBefore = null;
        this.currentAfter = null;
    }
    onTestCaseStarted(data) {
        const feature = this.featureMap.get(data.sourceLocation.uri);
        if (feature === undefined || feature.feature === undefined) {
            throw new Error("Unknown feature");
        }
        const test = feature.caseMap === undefined
            ? undefined : feature.caseMap.get(data.sourceLocation.line);
        if (test === undefined) {
            throw new Error("Unknown scenario");
        }
        this.currentGroup = this.allureRuntime.startGroup();
        this.currentTest =
            this.currentGroup.startTest(utilities_1.applyExample(test.name || "Unnamed test", test.example));
        const info = {
            uri: data.sourceLocation.uri,
            f: feature.feature.name,
            t: test.name,
            a: null
        };
        if (test.example !== undefined) {
            info.a = test.example.arguments;
            for (const prop in test.example.arguments) {
                if (!test.example.arguments[prop]) {
                    continue;
                }
                this.currentTest.addParameter(prop, test.example.arguments[prop]);
            }
        }
        this.currentTest.historyId = utilities_1.hash(JSON.stringify(info));
        this.currentTest.addLabel(allure_js_commons_1.LabelName.THREAD, `${process.pid}`);
        this.currentTest.fullName = `${data.sourceLocation.uri}:${feature.feature.name}:${test.name}`;
        this.currentTest.addLabel(allure_js_commons_1.LabelName.FEATURE, feature.feature.name);
        this.currentTest.description = utilities_1.stripIndent(test.description || "");
        for (const tag of [...(test.tags || []), ...feature.feature.tags]) {
            this.currentTest.addLabel(allure_js_commons_1.LabelName.TAG, tag.name);
            for (const label in this.labels) {
                if (!this.labels[label]) {
                    continue;
                }
                for (const reg of this.labels[label]) {
                    const match = tag.name.match(reg);
                    if (match != null && match.length > 1) {
                        this.currentTest.addLabel(label, match[1]);
                    }
                }
            }
            if (this.links.issue) {
                for (const reg of this.links.issue.pattern) {
                    const match = tag.name.match(reg);
                    if (match != null && match.length > 1) {
                        this.currentTest.addIssueLink(this.links.issue.urlTemplate.replace("%s", match[1]), match[1]);
                    }
                }
            }
            if (this.links.tms) {
                for (const reg of this.links.tms.pattern) {
                    const match = tag.name.match(reg);
                    if (match != null && match.length > 1) {
                        this.currentTest.addTmsLink(this.links.tms.urlTemplate.replace("%s", match[1]), match[1]);
                    }
                }
            }
        }
    }
    onTestStepAttachment(data) {
        if (this.currentStep === null) {
            throw new Error("There is no step to add attachment to");
        }
        const type = data.media.type;
        let content = data.data;
        if ([allure_js_commons_1.ContentType.JPEG, allure_js_commons_1.ContentType.PNG, allure_js_commons_1.ContentType.WEBM].indexOf(type) >= 0) {
            content = Buffer.from(content, "base64");
        }
        const file = this.allureRuntime.writeAttachment(content, { contentType: type });
        this.currentStep.addAttachment("attached", type, file);
    }
    onTestStepFinished(data) {
        const currentStep = this.currentStep;
        if (currentStep === null) {
            throw new Error("No current step defined");
        }
        currentStep.status = utilities_1.statusTextToAllure(data.result.status);
        currentStep.stage = utilities_1.statusTextToStage(data.result.status);
        this.setException(currentStep, data.result.exception);
        currentStep.endStep();
        this.popStep();
    }
    onTestStepStarted(data) {
        const location = (this.stepsMap.get(SourceLocation_1.SourceLocation.toKey(data.testCase)) || [])[data.index];
        const feature = this.featureMap.get(data.testCase.sourceLocation.uri);
        if (feature === undefined) {
            throw new Error("Unknown feature");
        }
        const test = feature.caseMap === undefined
            ? undefined : feature.caseMap.get(data.testCase.sourceLocation.line);
        if (test === undefined) {
            throw new Error("Unknown scenario");
        }
        let step;
        if (location.sourceLocation !== undefined && feature.stepMap !== undefined) {
            step = test.stepMap.get(location.sourceLocation.line)
                || feature.stepMap.get(location.sourceLocation.line);
        }
        else {
            if (location.actionLocation === undefined) {
                location.actionLocation = {
                    uri: "unknown",
                    line: -1
                };
            }
            step = {
                location: { line: -1 },
                text: `${location.actionLocation.uri}:${location.actionLocation.line}`,
                keyword: ""
            };
        }
        if (step === undefined) {
            throw new Error("Unknown step");
        }
        let stepText = utilities_1.applyExample(`${step.keyword}${step.text}`, test.example);
        const isAfter = this.afterHooks.find(({ uri, line }) => {
            if (location.actionLocation === undefined) {
                return false;
            }
            return uri === location.actionLocation.uri &&
                line === location.actionLocation.line;
        });
        const isBefore = this.beforeHooks.find(({ uri, line }) => {
            if (location.actionLocation === undefined) {
                return false;
            }
            return uri === location.actionLocation.uri &&
                line === location.actionLocation.line;
        });
        if (step.isBackground) {
            if (this.currentBefore === null) {
                this.currentBefore = this.currentGroup.addBefore();
            }
        }
        else if (isBefore) {
            if (this.currentBefore === null) {
                this.currentBefore = this.currentGroup.addBefore();
            }
            stepText = `Before: ${isBefore.code.name || step.text}`;
        }
        else if (isAfter) {
            if (this.currentAfter === null) {
                this.currentAfter = this.currentGroup.addAfter();
            }
            stepText = `After: ${isAfter.code.name || step.text}`;
        }
        else {
            if (this.currentBefore !== null) {
                this.currentBefore = null;
            }
            if (this.currentAfter !== null) {
                this.currentAfter = null;
            }
        }
        const allureStep = (this.currentAfter || this.currentBefore || this.currentTest).startStep(stepText);
        this.pushStep(allureStep);
        if (step.argument !== undefined) {
            if (step.argument.content !== undefined) {
                const file = this.allureRuntime.writeAttachment(step.argument.content, {
                    contentType: allure_js_commons_1.ContentType.TEXT
                });
                allureStep.addAttachment("Text", allure_js_commons_1.ContentType.TEXT, file);
            }
            if (step.argument.rows !== undefined) {
                const file = this.allureRuntime.writeAttachment(step.argument.rows.map(row => row.cells.map(cell => cell.value.replace(/\t/g, "    ")).join("\t")).join("\n"), { contentType: allure_js_commons_1.ContentType.TSV });
                allureStep.addAttachment("Table", allure_js_commons_1.ContentType.TSV, file);
            }
        }
    }
    popStep() {
        this.stepStack.pop();
    }
    pushStep(step) {
        this.stepStack.push(step);
    }
    writeAttachment(content, options) {
        return this.allureRuntime.writeAttachment(content, options);
    }
    setException(target, exception) {
        if (exception !== undefined) {
            if (typeof exception === "string") {
                target.detailsMessage = this.exceptionFormatter(exception);
            }
            else {
                target.detailsMessage =
                    this.exceptionFormatter(exception.message || "Error.message === undefined");
                target.detailsTrace = exception.stack || "";
            }
        }
    }
}
exports.CucumberJSAllureFormatter = CucumberJSAllureFormatter;
//# sourceMappingURL=CucumberJSAllureReporter.js.map