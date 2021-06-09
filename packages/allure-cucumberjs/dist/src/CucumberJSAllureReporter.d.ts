/// <reference types="node" />
import { Allure, AllureGroup, AllureRuntime, AllureStep, AllureTest, AttachmentOptions, ContentType, ExecutableItemWrapper } from "allure-js-commons";
import { Formatter, World as CucumberWorld } from "cucumber";
import { GherkinDocument } from "./events/GherkinDocument";
import { Result } from "./events/Result";
import { SourceLocation } from "./events/SourceLocation";
export { Allure } from "allure-js-commons";
export interface World extends CucumberWorld {
    allure: Allure;
}
export declare class CucumberJSAllureFormatterConfig {
    exceptionFormatter?: (message: string) => string;
    labels?: {
        [key: string]: RegExp[];
    };
    links?: {
        issue?: {
            pattern: RegExp[];
            urlTemplate: string;
        };
        tms?: {
            pattern: RegExp[];
            urlTemplate: string;
        };
    };
}
export declare class CucumberJSAllureFormatter extends Formatter {
    private readonly allureRuntime;
    readonly allureInterface: Allure;
    currentAfter: ExecutableItemWrapper | null;
    currentBefore: ExecutableItemWrapper | null;
    currentGroup: AllureGroup | null;
    currentTest: AllureTest | null;
    private readonly afterHooks;
    private readonly beforeHooks;
    private readonly exceptionFormatter;
    private readonly featureMap;
    private readonly labels;
    private readonly links;
    private readonly sourceMap;
    private stepStack;
    private readonly stepsMap;
    constructor(options: any, allureRuntime: AllureRuntime, config: CucumberJSAllureFormatterConfig);
    get currentStep(): AllureStep | null;
    onGherkinDocument(data: {
        uri: string;
        document: GherkinDocument;
    }): void;
    onSource(data: {
        uri: string;
        data: string;
        media: {
            encoding: string;
            type: string;
        };
    }): void;
    onTestCaseFinished(data: {
        result: Result;
    } & SourceLocation): void;
    onTestCasePrepared(data: {
        steps: SourceLocation[];
    } & SourceLocation): void;
    onTestCaseStarted(data: SourceLocation): void;
    onTestStepAttachment(data: {
        index: number;
        data: string;
        media: {
            type: string;
        };
        testCase: SourceLocation;
    }): void;
    onTestStepFinished(data: {
        index: number;
        result: Result;
        testCase: SourceLocation;
    }): void;
    onTestStepStarted(data: {
        index: number;
        testCase: SourceLocation;
    }): void;
    popStep(): void;
    pushStep(step: AllureStep): void;
    writeAttachment(content: Buffer | string, options: ContentType | string | AttachmentOptions): string;
    private setException;
}
