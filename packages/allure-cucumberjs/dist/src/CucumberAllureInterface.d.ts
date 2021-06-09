/// <reference types="node" />
import { Allure, AllureStep, AllureTest, AttachmentOptions, ContentType, ExecutableItemWrapper, Status, StepInterface, AllureRuntime } from "allure-js-commons";
import { CucumberJSAllureFormatter } from "./CucumberJSAllureReporter";
export declare class CucumberAllureInterface extends Allure {
    private readonly reporter;
    constructor(reporter: CucumberJSAllureFormatter, runtime: AllureRuntime);
    protected get currentExecutable(): ExecutableItemWrapper;
    protected get currentTest(): AllureTest;
    private startStep;
    step<T>(name: string, body: (step: StepInterface) => any): any;
    logStep(name: string, status?: Status): void;
    attachment(name: string, content: Buffer | string, options: ContentType | string | AttachmentOptions): void;
    testAttachment(name: string, content: Buffer | string, options: ContentType | string | AttachmentOptions): void;
    addParameter(name: string, value: string): void;
    addLabel(name: string, value: string): void;
    addIssueLink(url: string, name: string): void;
    addTmsLink(url: string, name: string): void;
}
export declare class WrappedStep {
    private readonly reporter;
    private readonly step;
    constructor(reporter: CucumberJSAllureFormatter, step: AllureStep);
    startStep(name: string): WrappedStep;
    endStep(): void;
    run<T>(body: (step: StepInterface) => T): T;
}
